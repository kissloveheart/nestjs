import { HttpExceptionCode, UserStatus } from '@enum';
import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { User, OTP } from './entity/user.entity';
import * as randomNumber from 'randomstring';
import * as moment from 'moment';
import { AppConfigService } from '@config';
import { ClsService } from 'nestjs-cls';
import { USER_TOKEN } from '@constant';
import { hashPin, isMatchPin } from '@utils';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
    private readonly configService: AppConfigService,
    private readonly clsService: ClsService,
  ) {
    super(userRepository);
  }

  async signup(payload: UserCreateDto): Promise<User> {
    if (await this.checkExistEmail(payload.email)) {
      throw new BadRequestException(`Email ${payload.email} already exist`);
    }
    const user = this.create(payload);
    return await this.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    const data = await this.findOne({
      where: {
        email,
        status: UserStatus.ACTIVE,
      },
    });

    return data;
  }

  async checkExistEmail(email: string): Promise<boolean> {
    const user = await this.findOne({
      where: {
        email,
      },
    });

    return !!user;
  }

  async generateOTP(user: User): Promise<string> {
    let code: string;

    do {
      code = randomNumber.generate({
        length: 6,
        charset: 'numeric',
      });
    } while (await this.findByOTP(code));

    user.otp = new OTP({ code });
    await this.save(user);
    return code;
  }

  async findByOTP(code: string): Promise<User> {
    const user = await this.findOne({
      where: {
        status: UserStatus.ACTIVE,
        'otp.code': code,
        'otp.consumed': false,
      },
    });

    return user;
  }

  async verifyOTP(code: string, email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) throw new BadRequestException(`Email ${email} already exist`);

    if (user.otp?.code !== code) {
      throw new BadRequestException('Invalid OTP');
    }

    if (
      user.otp.createdDate <
        moment()
          .subtract(this.configService.OTPExpiredMinutes(), 'minutes')
          .toDate() ||
      user.otp.consumed
    ) {
      throw new BadRequestException('OTP is expired');
    }
    user.otp = {
      ...user.otp,
      consumed: true,
      consumedDate: new Date(),
    };

    return await this.save(user);
  }

  getUserFromCls() {
    return this.clsService.get<User>(USER_TOKEN);
  }

  async createPin(pin: string) {
    const user = this.getUserFromCls();
    if (user.isSetupPin) throw new BadRequestException('PIN already setup');
    const { salt, hash } = await hashPin(pin);

    user.securityInformation = {
      ...user.securityInformation,
      pin: hash,
      salt,
      pinUpdatedDate: new Date(),
      failedPinCount: 0,
    };

    user.isSetupPin = true;
    await this.save(user);
  }

  async verifyPin(pin: string) {
    const user = this.getUserFromCls();

    if (!user.isSetupPin) throw new BadRequestException('Need to set pin code');

    if (
      user?.securityInformation.failedPinCount >=
      this.configService.user().numberFailedPinLimit
    ) {
      user.isSetupPin = false;
      await this.save(user);
      throw new HttpException(
        'You have entered the wrong pin too many times',
        HttpExceptionCode.NUMBER_FAILED_PIN_EXCEED_LIMIT,
      );
    }

    if (!(await isMatchPin(pin, user?.securityInformation.pin))) {
      user.securityInformation.failedPinCount = ++user.securityInformation
        .failedPinCount;
      await this.save(user);
      throw new UnauthorizedException('Invalid PIN');
    }
  }
}
