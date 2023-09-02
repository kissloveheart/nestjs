import { UserStatus } from '@enum';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { UserEntity, OTP } from './entities/user.entity';
import * as randomNumber from 'randomstring';
import * as moment from 'moment';
import { AppConfigService } from '@config';

@Injectable()
export class UserService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: MongoRepository<UserEntity>,
    private readonly configService: AppConfigService,
  ) {
    super(userRepository);
  }

  async signup(payload: UserCreateDto): Promise<UserEntity> {
    if (await this.checkExistEmail(payload.email)) {
      throw new BadRequestException(`Email ${payload.email} already exist`);
    }
    const user = this.create(payload);
    return await this.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const data = await this.findOne({
      where: {
        email,
        status: UserStatus.ACTIVE,
      },
    });

    return data;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserEntity> {
    const data = await this.findOne({
      where: {
        phoneNumber,
        status: UserStatus.ACTIVE,
      },
    });

    return data;
  }

  async checkExistEmail(email: string): Promise<boolean> {
    return !!(await this.findByEmail(email));
  }

  async generateOTP(user: UserEntity): Promise<string> {
    let code: string;

    do {
      code = randomNumber.generate({
        length: 6,
        charset: 'numeric',
      });
    } while (!!(await this.findByOTP(code)));

    user.otp = new OTP({ code });
    await this.save(user);
    return code;
  }

  async findByOTP(code: string): Promise<UserEntity> {
    const user = await this.findOne({
      where: {
        status: UserStatus.ACTIVE,
        'otp.code': code,
        'otp.consumed': false,
      },
    });

    return user;
  }

  async verifyOTP(code: string): Promise<UserEntity> {
    const user = await this.findByOTP(code);
    if (!user) throw new BadRequestException('Invalid OTP');

    if (
      user.otp.createdDate <
      moment()
        .subtract(this.configService.OTPExpiredMinutes(), 'minutes')
        .toDate()
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
}
