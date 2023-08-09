import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from '@modules/role';
import { UserEntity } from './dto/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), RoleModule],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
