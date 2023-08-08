import { Role } from '@/entities/role.entity';
import { BaseService } from '@/shared/base/base.abstract.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';

@Injectable()
export class RoleService extends BaseService<Role> {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: MongoRepository<Role>,
	) {
		super(roleRepository);
	}
}
