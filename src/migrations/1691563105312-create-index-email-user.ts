import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class CreateIndexEmailUser1691563105312 implements MigrationInterface {
	public async up(queryRunner: MongoQueryRunner): Promise<void> {
		await queryRunner.createCollectionIndex(
			'user',
			{ email: 1 },
			{ unique: true },
		);
	}

	public async down(queryRunner: MongoQueryRunner): Promise<void> {}
}
