import { AppConfigService } from '@config';
import { UserEntity, UserService } from '@modules/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwilioService } from '@shared/twilio';
import { EmailService } from '@shared/email';
import { VerifyType } from '@enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
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

  async sendOTPByEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException(`Email ${email} does not exist`);
    const code = await this.userService.generateOTP(user);
    this.emailService.send(
      email,
      'Your Kith & Kin login code',
      `<h3>Welcome to Kith and Kin!</h3>
      <p>Hi ${user.firstName}!</p>
      <p>Your login code is <strong>${code}</strong>.<p>
      <p>Note: for security reasons, the above code will expire in 10 minutes.<p>`,
    );
  }

  async sendOTPBySMS(phoneNumber: string) {
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    if (!user)
      throw new BadRequestException(
        `Phone number ${phoneNumber} does not exist`,
      );
    const code = await this.userService.generateOTP(user);
    this.twilioService.send(phoneNumber, `Your Kith & Kin login code ${code}`);
  }
}
