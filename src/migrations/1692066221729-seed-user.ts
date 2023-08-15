import { RoleName } from '@enum';
import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class SeedUser1692066221729 implements MigrationInterface {
	public async up(queryRunner: MongoQueryRunner): Promise<void> {
		if (process.env.NODE_ENV === 'production') return;

		const roleAdmin = await queryRunner.cursor('role', {
			name: { $eq: RoleName.ADMIN },
		});

		if (!(await roleAdmin.hasNext())) return;
		const roleAdminId = (await roleAdmin.next())._id;

		await queryRunner.insertMany('user', [
			{
				createdTime: new Date('2023-08-09T07:25:20.407Z'),
				email: 'hiep.nguyenvan1@ncc.asia',
				firstName: 'hiep',
				lastName: 'nguyen',
				phoneNumber: '1234',
				pin: 1234,
				role_ids: [roleAdminId],
				status: 'active',
				updatedTime: new Date('2023-08-09T07:25:20.407Z'),
			},
			{
				createdTime: new Date('2023-08-09T07:25:20.407Z'),
				email: 'y.levan@ncc.asia',
				firstName: 'y',
				lastName: 'le',
				phoneNumber: '1234',
				pin: 1234,
				role_ids: [roleAdminId],
				status: 'active',
				updatedTime: new Date('2023-08-09T07:25:20.407Z'),
			},
			{
				createdTime: new Date('2023-08-09T07:25:20.407Z'),
				email: 'loc.nguyentrandai@ncc.asia',
				firstName: 'loc',
				lastName: 'nguyen tran ',
				phoneNumber: '1234',
				pin: 1234,
				role_ids: [roleAdminId],
				status: 'active',
				updatedTime: new Date('2023-08-09T07:25:20.407Z'),
			},
		]);
	}

	public async down(queryRunner: MongoQueryRunner): Promise<void> {}
}
