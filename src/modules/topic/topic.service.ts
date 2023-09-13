import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { Topic } from './entity/topic.entity';

@Injectable()
export class TopicService extends BaseService<Topic> {
  constructor(
    @InjectRepository(Topic)
    private readonly topicRepository: MongoRepository<Topic>,
    private readonly log: LogService,
  ) {
    super(topicRepository, Topic.name);
    this.log.setContext(TopicService.name);
  }
}
