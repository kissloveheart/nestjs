import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@config';
import { JwtPayload } from '../dto/jwt-payload.dto';
import { UserService } from '@modules/user';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly appConfig: AppConfigService,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: appConfig.getJwt().access.secret,
		});
	}

	async validate(payload: JwtPayload) {
		//TODO integrate with cache when logout
		const user = await this.userService.findByEmail(payload.emailAddress);
		return user;
	}
}
