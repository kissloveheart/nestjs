import { FindAllResponse } from 'src/types/common.type';
import { BaseEntity } from '@/modules/base/base.entity';
import { BaseRepositoryInterface } from '@/repositories/base/base.interface.repository';

export abstract class BaseServiceAbstract<T extends BaseEntity> {
	constructor(private readonly repository: BaseRepositoryInterface<T>) {}

	async create(createDto: T | Partial<T>): Promise<T> {
		return await this.repository.create(createDto);
	}

	async findAll(
		filter?: object,
		options?: object,
	): Promise<FindAllResponse<T>> {
		return await this.repository.findAll(filter, options);
	}

	async findOne(id: string) {
		return await this.repository.findOneById(id);
	}

	async findOneByCondition(filter: Partial<T>) {
		return await this.repository.findOneByCondition(filter);
	}

	async update(id: string, updateDto: Partial<T>) {
		return await this.repository.update(id, updateDto);
	}

	async remove(id: string) {
		return await this.repository.softDelete(id);
	}
}
