import { User } from '@/entities/user.entity';
import { BaseService } from '@/shared/base/base.abstract.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RoleService } from '../role/role.service';

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
