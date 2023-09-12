import { NotFoundException } from '@nestjs/common';
import {
  AggregateOptions,
  CountOptions,
  DeepPartial,
  FilterOperators,
  FindManyOptions,
  MongoRepository,
  ObjectId,
  ObjectLiteral,
} from 'typeorm';
import { MongoFindManyOptions } from 'typeorm/find-options/mongodb/MongoFindManyOptions';
import { MongoFindOneOptions } from 'typeorm/find-options/mongodb/MongoFindOneOptions';
import { AuditEntity } from './audit.entity';

export abstract class BaseService<T extends AuditEntity> {
  private readonly instance: new () => T;

  constructor(
    private readonly repository: MongoRepository<T>,
    instance: new () => T,
  ) {
    this.instance = instance;
  }

  create(dto: DeepPartial<T>): T {
    return this.repository.create(dto);
  }

  async save(entity: T): Promise<T> {
    const data = await this.repository.save(entity);
    return this.create(data);
  }

  async saveAll(entities: T[]): Promise<T[]> {
    return await this.repository.save(entities);
  }

  async find(filter?: FindManyOptions<T> | FilterOperators<T>): Promise<T[]> {
    return await this.repository.find(filter);
  }

  async findAndCount(filter?: MongoFindManyOptions<T>): Promise<[T[], number]> {
    return await this.repository.findAndCount(filter);
  }

  async findAnfCountMongo(
    filter?: FindManyOptions<T> | FilterOperators<T>,
  ): Promise<[T[], number]> {
    const data = await this.find(filter);
    const count = await this.count(filter?.where);
    return [data, count];
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

  async softDelete(id: ObjectId) {
    const data = await this.findOne({
      where: {
        _id: id,
        deletedTime: null,
      },
    });

    if (!data)
      throw new NotFoundException(`${this.instance.name} ${id} does not exist`);

    data.deletedTime = new Date();
    await this.save(data);
  }

  async aggregate(pipeline: ObjectLiteral[], options?: AggregateOptions) {
    return this.repository.aggregate(pipeline, options);
  }

  async aggregateEntity(pipeline: ObjectLiteral[], options?: AggregateOptions) {
    return this.repository.aggregateEntity(pipeline, options);
  }
}
