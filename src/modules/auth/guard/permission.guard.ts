import { ACTION_KEY, SCOPE_KEY } from '@constant';
import { Action, Scope } from '@enum';
import { UserEntity } from '@modules/user';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isPublicRequest } from './is-public-request.utils';

@Injectable()
export class PermissionGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		if (isPublicRequest(this.reflector, context)) {
			return true;
		}
		const scope = this.reflector.get<Scope>(SCOPE_KEY, context.getClass());

		const permitActions = this.reflector.getAllAndOverride<Action[]>(
			ACTION_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (!scope) return true;

		const { user }: { user: UserEntity } = context.switchToHttp().getRequest();
		if (!user) return false;

		const { roles } = user;
		if (!roles) {
			return false;
		}

		for (const role of roles) {
			for (const permission of role.permissions) {
				if (!permission) continue;

				if (permission.scope !== scope) continue;

				if (!permitActions || permitActions.length === 0) return true;

				if (!permission.actions || permission.actions.length === 0) continue;

				if (permission.actions.some((action) => action === Action.MANAGE))
					return true;

				const hasPermission = permission.actions.some((action) =>
					permitActions.includes(action),
				);
				if (hasPermission) return true;
			}
		}

		return false;
	}
}
