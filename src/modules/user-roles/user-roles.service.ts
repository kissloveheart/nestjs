import { Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { UserRole } from '@/modules/user-roles/entities/user-role.entity';
import { UserRolesRepository } from '@/repositories/user-roles.repository';

@Injectable()
export class UserRolesService extends BaseServiceAbstract<UserRole> {
	constructor(private readonly userRolesRepository: UserRolesRepository) {
		super(userRolesRepository);
	}
}
