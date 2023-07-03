import { BaseRepositoryAbstract } from '@/repositories/base/base.abstract.repository';
import { UserRole } from '@/modules/user-roles/entities/user-role.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRolesRepository extends BaseRepositoryAbstract<UserRole> {
	constructor(
		@InjectModel(UserRole.name) private readonly userRoleModel: Model<UserRole>,
	) {
		super(userRoleModel);
	}
}
