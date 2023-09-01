import { AppConfigService } from '@config';
import { UserEntity, UserService } from '@modules/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwilioService } from '@shared/twilio';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly twilioService: TwilioService,
  ) {}

  async createAccessToken(emailAddress: string) {
    return this.jwtService.sign(
      { emailAddress },
      {
        secret: this.appConfigService.jwt().secret,
      },
    );
  }

  async login(user: UserEntity) {
    const accessToken = await this.createAccessToken(user.email);
    return {
      accessToken,
    };
  }

  async logout(user: UserEntity) {
    user.endSessionDate = new Date();
    await this.userService.save(user);
  }

  async sendVerifyCode(email: string) {
    if (!(await this.userService.checkExistEmail(email)))
      throw new BadRequestException();
    this.twilioService.sendVerification(email);
  }

  async checkVerification(email: string, code: string) {
    return await this.twilioService.checkVerification(email, code);
  }
}
