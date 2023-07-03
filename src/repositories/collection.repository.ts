import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@/repositories/base/base.abstract.repository';
import { Collection } from '@/modules/collection/entities/collection.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CollectionRepository extends BaseRepositoryAbstract<Collection> {
	constructor(
		@InjectModel(Collection.name)
		private readonly collectionModel: Model<Collection>,
	) {
		super(collectionModel);
	}
}
