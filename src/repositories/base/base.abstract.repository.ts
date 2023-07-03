import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { FindAllResponse } from 'src/types/common.type';
import { BaseRepositoryInterface } from './base.interface.repository';
import { BaseEntity } from '@/modules/base/base.entity';

export abstract class BaseRepositoryAbstract<T extends BaseEntity>
	implements BaseRepositoryInterface<T>
{
	protected constructor(private readonly model: Model<T>) {
		this.model = model;
	}

	async create(dto: T | Partial<T>): Promise<T> {
		const created_data = await this.model.create(dto);
		return created_data.save();
	}

	async findOneById(id: string): Promise<T> {
		const item = await this.model.findById(id);
		return item.deletedAt ? null : item;
	}

	async findOneByCondition(condition = {}): Promise<T> {
		return await this.model
			.findOne({
				...condition,
				deletedAt: null,
			})
			.exec();
	}

	async findAll(
		condition: FilterQuery<T>,
		options?: QueryOptions<T>,
	): Promise<FindAllResponse<T>> {
		const [count, items] = await Promise.all([
			this.model.count({ ...condition, deleted_at: null }),
			this.model.find(
				{
					...condition,
					deletedAt: null,
				},
				options?.projection,
				options,
			),
		]);
		return {
			count,
			items,
		};
	}

	async update(id: string, dto: Partial<T>): Promise<T> {
		return await this.model.findOneAndUpdate(
			{ _id: id, deletedAt: null },
			dto,
			{ new: true, runValidators: true },
		);
	}

	async softDelete(id: string): Promise<boolean> {
		const deleteItem = await this.model.findById(id);
		if (!deleteItem) {
			return false;
		}

		return !!(await this.model
			.findByIdAndUpdate<T>(id, { deleted_at: new Date() })
			.exec());
	}

	async permanentlyDelete(id: string): Promise<boolean> {
		const deleteItem = await this.model.findById(id);
		if (!deleteItem) {
			return false;
		}
		return !!(await this.model.findByIdAndDelete(id));
	}
}
