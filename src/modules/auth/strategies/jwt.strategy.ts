import { AppConfigService } from '@config';
import { UserService } from '@modules/user';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { validateIat } from '../auth.utils';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly appConfig: AppConfigService,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private readonly userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: appConfig.jwt().access.secret,
		});
	}

	async validate(payload: JwtPayload) {
		const currentIat = await this.cacheManager.get<number | undefined>(
			payload.emailAddress,
		);

		validateIat(currentIat, payload.iat);

		const user = await this.userService.findByEmailWithRoles(
			payload.emailAddress,
		);
		return user;
	}
}
