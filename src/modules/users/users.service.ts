import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { User } from '@/modules/users/entities/user.entity';
import { UsersRepository } from '@/repositories/users.repository';
import { UserRolesService } from '@/modules/user-roles/user-roles.service';
import { USER_ROLE } from '@/modules/user-roles/entities/user-role.entity';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly userRolesService: UserRolesService,
	) {
		super(usersRepository);
	}

	async create(createUserDto: CreateUserDto) {
		const userRole = await this.userRolesService.findOneByCondition({
			name: USER_ROLE.USER,
		});
		const user = await this.usersRepository.create({
			...createUserDto,
			role: userRole,
		});
		return user;
	}
}
