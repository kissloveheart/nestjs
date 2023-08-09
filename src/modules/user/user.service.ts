import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { RoleService } from '@modules/role';
import { BaseService } from '@shared';
import { UserEntity } from './dto/user.entity';
import { RoleName } from '@enum';
import { UserCreateDto } from './dto/user-create.dto';

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

	async findByEmail(email: string) {
		const cursor = await this.aggregateEntity([
			{
				$match: {
					email: email,
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
}
