import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@/repositories/base/base.abstract.repository';
import { Topic } from '@/modules/topics/entities/topic.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TopicsRepository extends BaseRepositoryAbstract<Topic> {
	constructor(
		@InjectModel(Topic.name) private readonly topicModel: Model<Topic>,
	) {
		super(topicModel);
	}
}
