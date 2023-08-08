import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { BaseService } from '@shared';
import { User } from '@entities';

@Injectable()
export class UserService extends BaseService<User> {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: MongoRepository<User>,
		private readonly roleService: RoleService,
	) {
		super(userRepository);
	}

	// async create(createUserDto: CreateUserDto) {
	// 	const userRole = await this.userRolesService.findOneByCondition({
	// 		name: USER_ROLE.USER,
	// 	});
	// 	const user = await this.userRepository.create({
	// 		...createUserDto,
	// 		role: userRole,
	// 	});
	// 	return user;
	// }
}
