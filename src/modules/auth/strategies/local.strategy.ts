import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserEntity } from '@modules/user';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email', passwordField: 'code' });
	}

	async validate(email: string, code: string): Promise<UserEntity> {
		const user = await this.authService.authentication(email, code);
		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
