import {
	AggregateOptions,
	CountOptions,
	DeepPartial,
	FindManyOptions,
	MongoRepository,
	ObjectId,
	ObjectLiteral,
} from 'typeorm';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';
import { AuditEntity } from './audit.entity';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';

export abstract class BaseService<T extends AuditEntity> {
	constructor(private readonly repository: MongoRepository<T>) {}

	async create(dto: DeepPartial<T>): Promise<T> {
		return this.repository.create(dto);
	}

	async save(entity: T): Promise<T> {
		return await this.repository.save(entity);
	}

	async saveAll(entities: T[]): Promise<T[]> {
		return await this.repository.save(entities);
	}

	async find(filter?: FindManyOptions<T>): Promise<T[]> {
		return await this.repository.find(filter);
	}

	async findAndCount(filter?: MongoFindManyOptions<T>): Promise<[T[], number]> {
		return await this.repository.findAndCount(filter);
	}

	async findById(id: ObjectId) {
		return await this.repository.findOneBy({
			_id: id,
		});
	}

	async findOne(filter?: MongoFindOneOptions<T>) {
		return await this.repository.findOne(filter);
	}

	async count(query?: ObjectLiteral, options?: CountOptions): Promise<number> {
		return await this.repository.count(query, options);
	}

	async delete(id: ObjectId) {
		return await this.repository.delete(id);
	}

	async aggregate(pipeline: ObjectLiteral[], options?: AggregateOptions) {
		return await this.repository.aggregate(pipeline, options);
	}

	async aggregateEntity(pipeline: ObjectLiteral[], options?: AggregateOptions) {
		return await this.repository.aggregateEntity(pipeline, options);
	}
}
