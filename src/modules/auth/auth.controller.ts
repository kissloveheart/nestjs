import { Public } from '@decorators';
import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { User } from '@modules/user';
import { LoginType } from '@enum';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('otp')
  @ApiOperation({
    summary: 'Verify OTP code',
  })
  @ApiQuery({ type: LoginDto })
  @UseGuards(OTPAuthGuard)
  async login(@Req() request) {
    return this.authService.login(request.user);
  }

  @ApiResponseGeneric({ model: User })
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

  @Get('otp/:email')
  @ApiOperation({
    summary: 'Get OTP by email or sms',
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
  @ApiQuery({
    name: 'type',
    required: true,
    type: 'string',
    enum: LoginType,
    example: LoginType.EMAIL,
  })
  async sendOTP(
    @Param('email', EmailValidation) email: string,
    @Query('type') type: LoginType,
  ) {
    await this.authService.sendOTP(email, type);
  }
}
