import { MigrationInterface } from 'typeorm';
import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';

export class Test1693581097990 implements MigrationInterface {
  public async up(queryRunner: MongoQueryRunner): Promise<void> {
    await queryRunner.insertOne('test', { test: 'test' });
  }

  public async down(queryRunner: MongoQueryRunner): Promise<void> {}
}
