import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from '@decorators';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guard/local.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('/login')
	@ApiBody({ type: LoginDto })
	@UseGuards(LocalAuthGuard)
	async login(@Req() req) {
		return this.authService.login(req.user);
	}
}
