import { Public } from '@decorators';
import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EmailValidation } from '@pipe';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/auth.dto';
import { OTPAuthGuard } from './guard/otp.guard';
import { ApiResponseGeneric } from '@types';
import { UserEntity } from '@modules/user';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP code',
  })
  @ApiQuery({ type: LoginDto })
  @UseGuards(OTPAuthGuard)
  async login(@Req() request) {
    return this.authService.login(request.user);
  }

  @ApiResponseGeneric({ model: UserEntity })
  @Get('me')
  @ApiOperation({
    summary: 'My profile',
  })
  @ApiBearerAuth()
  async me(@Req() request) {
    return request.user;
  }

  @Post('logout')
  @ApiBearerAuth()
  async logout(@Req() request) {
    await this.authService.logout(request.user);
  }

  @Get('send-opt/email/:email')
  @ApiOperation({
    summary: 'Login by email',
  })
  @Public()
  @ApiParam({
    name: 'email',
    required: true,
    type: String,
    examples: {
      'hiep.nguyenvan1@ncc.asia': {
        value: 'hiep.nguyenvan1@ncc.asia',
      },
    },
  })
  async sendOTPByEmail(@Param('email', EmailValidation) email: string) {
    await this.authService.sendOTPByEmail(email);
  }

  @Get('send-opt/sms/:phoneNumber')
  @ApiOperation({
    summary: 'Login by sms',
  })
  @Public()
  @ApiParam({
    name: 'phoneNumber',
    required: true,
    type: String,
    examples: {
      'hiep.nguyenvan1@ncc.asia': {
        value: '+84393916840',
      },
    },
  })
  async sendOTPBySMS(@Param('phoneNumber') phoneNumber: string) {
    await this.authService.sendOTPBySMS(phoneNumber);
  }
}
