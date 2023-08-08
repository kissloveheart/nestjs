import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '@modules';

@Module({
	imports: [TypeOrmModule.forFeature([User]), RoleModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
