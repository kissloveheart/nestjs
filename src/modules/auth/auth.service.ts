import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from '@config';
import { UserEntity } from '@modules/user';

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		private readonly jwtService: JwtService,
		private readonly appConfigService: AppConfigService,
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
		const accessToken = await this.createAccessToken(user.email);
		const refreshToken = await this.createRefreshToken(user.email);
		return {
			accessToken,
			refreshToken,
		};
	}
}
