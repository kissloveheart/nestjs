import { AppConfigService } from '@config';
import { LoginType, ThirdPartyLogin } from '@enum';
import { LogService } from '@log';
import { User, UserService } from '@modules/user';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '@shared/email';
import { TwilioService } from '@shared/twilio';
import { OAuth2Client } from 'google-auth-library';
import verifyAppleTokenClient from 'verify-apple-id-token';
import { ThirdPartyLoginPayload } from '@types';

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client();

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    private readonly twilioService: TwilioService,
    private readonly emailService: EmailService,
    private readonly log: LogService,
  ) {}

  async createAccessToken(emailAddress: string) {
    return this.jwtService.sign(
      { emailAddress },
      {
        secret: this.configService.jwt().secret,
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

  async verifyThirdPartyToken(
    thirdParty: ThirdPartyLogin,
    token: string,
  ): Promise<ThirdPartyLoginPayload> {
    switch (thirdParty) {
      case ThirdPartyLogin.APPLE:
        return this.verifyAppleToken(token);
      case ThirdPartyLogin.GOOGLE:
        return this.verifyGoogleToken(token);
      default:
        throw new BadRequestException(`Unknown third party ${thirdParty}`);
    }
  }

  async verifyGoogleToken(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: this.configService.google().clientId,
      });
      const payload = ticket.getPayload();
      return {
        email: payload.email,
      };
    } catch (err) {
      this.log.error(err);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async handleThirdPartyLogin(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      // TODO need check flow google login to handle next action
      throw new InternalServerErrorException(
        "Method register haven't implemented yet",
      );
    }
    const accessToken = await this.createAccessToken(email);
    return {
      accessToken,
    };
  }

  async verifyAppleToken(token: string) {
    try {
      const jwtClaims = await verifyAppleTokenClient({
        idToken: token,
        clientId: this.configService.apple().clientId,
      });
      return {
        email: jwtClaims.email,
      };
    } catch (err) {
      this.log.error(err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
