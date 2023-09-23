import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailModule } from '@shared/email';
import { TwilioModule } from '@shared/twilio';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { OTPStrategy } from './strategies/otp.strategy';
import { ThirdPartyStrategy } from './strategies/third-party.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({}),
    PassportModule,
    EmailModule,
    TwilioModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, OTPStrategy, ThirdPartyStrategy],
})
export class AuthModule {}
