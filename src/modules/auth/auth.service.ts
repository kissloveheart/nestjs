import { AppConfigService } from '@config';
import { LoginType } from '@enum';
import { LogService } from '@log';
import { User, UserService } from '@modules/user';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@shared/email';
import { TwilioService } from '@shared/twilio';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly appConfigService: AppConfigService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
    private readonly log: LogService,
  ) {}

  async createAccessToken(emailAddress: string) {
    return this.jwtService.sign(
      { emailAddress },
      {
        secret: this.appConfigService.jwt().secret,
      },
    );
  }

  async login(user: User) {
    const accessToken = await this.createAccessToken(user.email);
    return {
      accessToken,
    };
  }

  async logout(user: User) {
    user.endSessionDate = new Date();
    await this.userService.save(user);
  }

  async sendOTP(email: string, type: LoginType) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new BadRequestException(`Email ${email} does not exist`);
    const code = await this.userService.generateOTP(user);
    switch (type) {
      case LoginType.EMAIL:
        this.sendOTPByEmail(user, code);
        break;
      case LoginType.SMS:
        this.sendOTPBySMS(user, code);
        break;
      default:
        this.log.warn(`Unknown login type ${type}`);
    }
  }

  async sendOTPByEmail(user: User, code: string) {
    this.emailService.send(
      user.email,
      'Your Kith & Kin login code',
      `<h3>Welcome to Kith and Kin!</h3>
      <p>Hi ${user.firstName}!</p>
      <p>Your login code is <strong>${code}</strong>.<p>
      <p>Note: for security reasons, the above code will expire in 10 minutes.<p>`,
    );
  }

  async sendOTPBySMS(user: User, code: string) {
    this.twilioService.send(
      user.phoneNumber,
      `Your Kith & Kin login code ${code}`,
    );
  }
}
