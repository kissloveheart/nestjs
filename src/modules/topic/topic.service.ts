import { LogService } from '@log';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { Topic } from './entity/topic.entity';
import { Profile } from '@modules/profile';
import { SyncTopicDto, TopicCreateDto } from './dto/topic.dto';
import { ObjectId } from 'mongodb';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { SYSTEM } from '@constant';

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

  async saveTopic(profile: Profile, payload: TopicCreateDto, id?: ObjectId) {
    let topic: Topic;
    if (id) {
      topic = await this.findOne({
        where: {
          _id: id,
          profile: profile._id,
          deletedTime: null,
        },
      });
      delete payload._id;
      if (!topic)
        throw new BadRequestException(`Topic ${id.toString()} does not exist`);
    } else {
      if (payload?._id) {
        const existTopic = await this.findOne({
          where: {
            _id: payload._id,
            profile: profile._id,
            deletedTime: null,
          },
        });
        if (existTopic)
          throw new ConflictException(`Topic ${payload._id} already exist`);
      }
      topic = this.create(payload);
      topic.profile = profile._id;
    }

    const data = await this.save({ ...topic, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Topic> = {
      where: {
        deletedTime: null,
        profile: profile._id,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [topics, count] = await this.findAndCount(filter);
    return new Pageable(topics, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Topic> | FilterOperators<Topic> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [topics, count] = await this.findAndCountMongo(filter);
    const syncTopics = topics.map((allergy) => new SyncTopicDto(allergy));
    return new Pageable(syncTopics, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const topic = await this.findOne({
      where: {
        _id: id,
        profile: profile._id,
        deletedTime: null,
      },
    });
    if (!topic)
      throw new NotFoundException(`Topic ${id.toString()} does not exist`);
    return topic;
  }

  async softDeleteTopicOfProfile(userId: ObjectId, profileId: ObjectId) {
    this.topicRepository.updateMany(
      {
        profile: profileId,
        deletedTime: null,
      },
      {
        $set: {
          deletedTime: new Date(),
          updatedTime: new Date(),
          updatedBy: userId ? userId : SYSTEM,
        },
        $inc: { __v: 1 },
      },
    );
  }
}
