import { MigrationInterface, QueryRunner } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class Migrations1691480344488 implements MigrationInterface {
	public async up(queryRunner: MongoQueryRunner): Promise<void> {
		queryRunner.insertOne('user', { test: 'hiep' });
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
