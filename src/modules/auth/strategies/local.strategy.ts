import { UserEntity, UserService } from '@modules/user';
import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/auth.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {
		super({ usernameField: 'email', passwordField: 'code' });
	}

	async validate(email: string, code: string): Promise<UserEntity> {
		const error = await validate(plainToClass(LoginDto, { email, code }));
		if (error.length > 0) {
			throw new BadRequestException(
				JSON.stringify(
					error.map((err) => Object.values(err.constraints).join(', ')),
				),
			);
		}
		const isVerified = await this.authService.checkVerification(email, code);
		if (!isVerified) throw new UnauthorizedException();

		const user = await this.userService.findByEmail(email);
		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
