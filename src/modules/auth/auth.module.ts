import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guard/jwt.guard';
import { PermissionGuard } from './guard/permission.guard';

@Module({
	imports: [UserModule, JwtModule.register({}), PassportModule],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_GUARD,
			useClass: PermissionGuard,
		},
	],
})
export class AuthModule {}
