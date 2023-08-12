import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RoleService } from '@modules/role';
import { UserEntity } from './dto/user.entity';
import { RoleName, UserStatus } from '@enum';
import { UserCreateDto } from './dto/user-create.dto';
import { BaseService } from '@shared/base';

@Injectable()
export class UserService extends BaseService<UserEntity> {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: MongoRepository<UserEntity>,
		private readonly roleService: RoleService,
	) {
		super(userRepository);
	}

	async create(dto: UserCreateDto) {
		const userRole = await this.roleService.find({
			where: {
				name: RoleName.ADMIN,
			},
		});
		const user = new UserEntity(dto);
		user.role_ids = userRole.map((role) => role.id);
		return await this.save(user);
	}

	async findByEmailWithRoles(email: string) {
		const cursor = await this.aggregateEntity([
			{
				$match: {
					email: email,
					status: UserStatus.ACTIVE,
				},
			},
			{
				$lookup: {
					from: 'role',
					localField: 'role_ids',
					foreignField: '_id',
					as: 'roles',
				},
			},
		]);

		return cursor.next();
	}

	async findByEmail(email: string) {
		const data = await this.findOne({
			where: {
				email,
				status: UserStatus.ACTIVE,
			},
		});

		return data;
	}
}
