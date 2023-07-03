import { Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { Collection } from '@/modules/collection/entities/collection.entity';
import { CollectionRepository } from '@/repositories/collection.repository';

@Injectable()
export class CollectionService extends BaseServiceAbstract<Collection> {
	constructor(private readonly collectionRepository: CollectionRepository) {
		super(collectionRepository);
	}
}
