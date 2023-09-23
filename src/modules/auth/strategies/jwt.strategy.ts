import { AppConfigService } from '@config';
import { UserService } from '@modules/user';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { ClsService } from 'nestjs-cls';
import { USER_TOKEN } from '@constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly appConfig: AppConfigService,
    private readonly userService: UserService,
    private readonly cls: ClsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: appConfig.jwt().secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findByEmail(payload.emailAddress);
    if (payload.iat * 1000 < user.endSessionDate.getTime()) {
      throw new UnauthorizedException('JWT token is expired');
    }
    this.cls.set(USER_TOKEN, user);
    return user;
  }
}
