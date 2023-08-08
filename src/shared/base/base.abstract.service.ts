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
import { AuditEntity } from '@entities';

export abstract class BaseService<T extends AuditEntity> {
	constructor(private readonly repository: MongoRepository<T>) {}

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

	async count(query?: ObjectLiteral, options?: CountOptions): Promise<number> {
		return await this.repository.count(query, options);
	}

	async delete(id: ObjectId) {
		return await this.repository.delete(id);
	}

	async aggregate(pipeline: ObjectLiteral[], options?: AggregateOptions) {
		return await this.repository.aggregate(pipeline, options);
	}
}
