import { AppConfigService } from '@config';
import { UserService } from '@modules/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: appConfig.jwt().secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findByEmail(payload.emailAddress);
    if (
      payload.iat * 1000 < user.endSessionDate.getTime() ||
      payload.iat * 1000 > user.otp.consumedDate.getTime()
    ) {
      throw new UnauthorizedException('JWT token is expired');
    }
    return user;
  }
}
