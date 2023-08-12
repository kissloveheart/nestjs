import { AppConfigService } from '@config';
import { USER_HAS_BEEN_LOGGED_OUT } from '@constant';
import { UserEntity, UserService } from '@modules/user';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwilioService } from '@shared/twilio';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly appConfigService: AppConfigService,
		private readonly twiliioService: TwilioService,
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {}

	async createAccessToken(emailAddress: string) {
		return this.jwtService.sign(
			{ emailAddress },
			{
				secret: this.appConfigService.jwt().access.secret,
				expiresIn: this.appConfigService.jwt().access.expiresIn,
			},
		);
	}

	async createRefreshToken(emailAddress: string) {
		return this.jwtService.sign(
			{ emailAddress },
			{
				secret: this.appConfigService.jwt().refresh.secret,
				expiresIn: this.appConfigService.jwt().refresh.expiresIn,
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

	async sendVerifyCode(email: string) {
		if (!(await this.checkExistEmail(email))) throw new BadRequestException();
		this.twiliioService.sendVerification(email);
	}

	async checkExistEmail(email: string) {
		return !!(await this.userService.findByEmail(email));
	}

	async checkVerification(email: string, code: string) {
		return await this.twiliioService.checkVerification(email, code);
	}
}
