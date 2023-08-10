import { AppConfigService } from '@config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { validateIat } from '../auth.utils';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(
		private readonly appConfigService: AppConfigService,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: appConfigService.getJwt().refresh.secret,
			ignoreExpiration: false,
		});
	}

	async validate(payload: JwtPayload): Promise<JwtPayload> {
		const { iat, exp, emailAddress } = payload;

		const currentIat = await this.cacheManager.get<number | undefined>(
			emailAddress,
		);

		validateIat(currentIat, iat);

		const remainingTime = exp * 1000 - Date.now();
		const cacheExpireTime = remainingTime > 0 ? remainingTime : 1;

		await this.cacheManager.set(emailAddress, iat, cacheExpireTime);
		return payload;
	}
}
