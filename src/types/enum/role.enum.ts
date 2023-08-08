export enum RoleName {
	ADMIN = 'Admin',
	USER = 'User',
}
export enum Action {
	CREATE = 'create',
	READ = 'read',
	DELETE = 'delete',
	UPDATE = 'update',
	MANAGE = 'manage',
}
export enum Scope {
	USER = 'user',
	ROLE = 'role',
}
const permission: {
	[key in RoleName]: {
		[key in Scope]: Action[];
	};
} = {
	[RoleName.ADMIN]: {
		[Scope.USER]: [Action.MANAGE],
		[Scope.ROLE]: [Action.MANAGE],
	},
	[RoleName.USER]: {
		[Scope.USER]: [Action.READ],
		[Scope.ROLE]: [Action.READ],
	},
};

export { permission };
