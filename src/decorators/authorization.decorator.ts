import { ACTION_KEY, SCOPE_KEY, SKIP_AUTH } from '@constant';
import { Action, Scope } from '@enum';
import { SetMetadata } from '@nestjs/common';

export const ScopePermission = (scope: Scope) => SetMetadata(SCOPE_KEY, scope);

export const PermitActions = (...actions: Action[]) =>
	SetMetadata(ACTION_KEY, actions);

export const Public = () => SetMetadata(SKIP_AUTH, true);
