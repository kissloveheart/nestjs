import { Public } from '@decorators';
import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailDto, LoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guard/local.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  async login(@Req() request) {
    return this.authService.login(request.user);
  }

  @Get('logout')
  @ApiBearerAuth()
  async logout(@Req() request) {
    await this.authService.logout(request.user);
  }

  @Get('send-verify-code')
  @Public()
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
    examples: {
      'hiep.nguyenvan1@ncc.asia': {
        value: 'hiep.nguyenvan1@ncc.asia',
      },
    },
  })
  sendVerifyCode(@Query() payload: EmailDto) {
    this.authService.sendVerifyCode(payload.email);
  }
}
