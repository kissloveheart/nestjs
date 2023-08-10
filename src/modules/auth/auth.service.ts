import { AppConfigService } from '@config';
import { USER_HAS_BEEN_LOGGED_OUT } from '@constant';
import { UserEntity } from '@modules/user';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly appConfigService: AppConfigService,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {}

	async authentication(email: string, code: string) {
		// TODO check code with Twillo
		const data = await this.userService.findOne({
			where: {
				email: email,
			},
		});
		return data;
	}

	async createAccessToken(emailAddress: string) {
		return this.jwtService.sign(
			{ emailAddress },
			{
				secret: this.appConfigService.getJwt().access.secret,
				expiresIn: this.appConfigService.getJwt().access.expiresIn,
			},
		);
	}

	async createRefreshToken(emailAddress: string) {
		return this.jwtService.sign(
			{ emailAddress },
			{
				secret: this.appConfigService.getJwt().refresh.secret,
				expiresIn: this.appConfigService.getJwt().refresh.expiresIn,
			},
		);
	}

	async login(user: UserEntity) {
		await this.cacheManager.del(user.email);
		return await this.createToken(user.email);
	}

	async logout(user: UserEntity) {
		await this.cacheManager.set(user.email, USER_HAS_BEEN_LOGGED_OUT, 0);
	}

	async createToken(email: string) {
		const accessToken = await this.createAccessToken(email);
		const refreshToken = await this.createRefreshToken(email);
		return {
			accessToken,
			refreshToken,
		};
	}
}
