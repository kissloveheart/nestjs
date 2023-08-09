import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { BaseService } from '@shared';
import { Role } from './dto/role.entity';

@Injectable()
export class RoleService extends BaseService<Role> {
	constructor(
		@InjectRepository(Role)
		private readonly roleRepository: MongoRepository<Role>,
	) {
		super(roleRepository);
	}
}
