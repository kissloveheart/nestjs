import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Action, RoleName, Scope } from '@enum';

export class SeedRole1691553221184 implements MigrationInterface {
	public async up(queryRunner: MongoQueryRunner): Promise<void> {
		const admin = {
			name: RoleName.ADMIN,
			permissions: [
				{
					scope: Scope.USER,
					actions: [Action.MANAGE],
				},
				{
					scope: Scope.ROLE,
					actions: [Action.MANAGE],
				},
			],
			createdTime: new Date(),
		};

		const user = {
			name: RoleName.USER,
			permissions: [
				{
					scope: Scope.USER,
					actions: [Action.READ],
				},
				{
					scope: Scope.ROLE,
					actions: [Action.READ],
				},
			],
			createdTime: new Date(),
		};

		await queryRunner.insertMany('role', [admin, user]);
	}

	public async down(queryRunner: MongoQueryRunner): Promise<void> {
		await queryRunner.deleteMany(
			'role',
			{
				name: { $in: [RoleName.ADMIN, RoleName.USER] },
			},
			{},
		);
	}
}
