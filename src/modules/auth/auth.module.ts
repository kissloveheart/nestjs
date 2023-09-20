import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard } from '@nestjs/throttler';
import { EmailModule } from '@shared/email';
import { TwilioModule } from '@shared/twilio';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt.guard';
import { OTPAuthGuard } from './guard/otp.guard';
import { RoleGuard } from './guard/role.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OTPStrategy } from './strategies/otp.strategy';
import { ThirdPartyStrategy } from './strategies/third-party.strategy';
import { ThirdPartyAuthGuard } from './guard/third-party.guard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    PassportModule,
    EmailModule,
    TwilioModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    OTPAuthGuard,
    JwtStrategy,
    OTPStrategy,
    ThirdPartyStrategy,
    ThirdPartyAuthGuard,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AuthModule {}
