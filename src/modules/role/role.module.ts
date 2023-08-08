import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RoleSeedService } from './role-seed.service';
import { Role } from '@entities';

@Module({
	imports: [TypeOrmModule.forFeature([Role])],
	controllers: [RoleController],
	providers: [RoleService, RoleSeedService],
	exports: [RoleService],
})
export class RoleModule {}
