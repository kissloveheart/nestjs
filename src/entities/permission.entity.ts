import { Column } from 'typeorm';
import { Action, Scope } from '../types/enum/role.enum';
import { IsEnum } from 'class-validator';

export class Permission {
	@Column()
	@IsEnum(Scope)
	scope: Scope;

	@Column()
	@IsEnum(Action, { each: true })
	actions: Action[];

	constructor(scope: Scope, actions: Action[]) {
		this.scope = scope;
		this.actions = actions;
	}
}
