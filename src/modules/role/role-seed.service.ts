import { Permission } from '@/entities/permission.entity';
import { Role } from '@/entities/role.entity';
import { RoleName, Scope, permission } from '@/enum/role.enum';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RoleService } from './role.service';

@Injectable()
export class RoleSeedService implements OnModuleInit {
	private readonly log = new Logger(RoleSeedService.name);
	constructor(private readonly roleService: RoleService) {}

	async onModuleInit() {
		this.seedRoles();
	}

	async seedRoles() {
		this.log.log('Seed default roles start');
		const existRoles = await this.roleService.find();
		const roleNames = Object.keys(RoleName).map(
			(key: keyof typeof RoleName) => RoleName[key],
		);
		const newRoles = roleNames
			.filter((roleName) => !existRoles.find((role) => roleName === role.name))
			.map((roleName) => {
				const newRole = new Role({
					name: roleName,
				});

				for (const scope in permission[roleName]) {
					const actions = permission[roleName][scope as Scope];
					newRole.permission = [
						...newRole.permission,
						new Permission(scope as Scope, actions),
					];
				}

				return newRole;
			});

		const saveRoles = await this.roleService.saveAll(newRoles);
		this.log.log(`${saveRoles.length} role have been created`, saveRoles);
	}
}
