import { AppConfigService } from '@config';
import { InviteType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import { Topic, TopicService } from '@modules/topic';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { EmailService } from '@shared/email';
import { TwilioService } from '@shared/twilio';
import { Pageable, TemporarySharePageRequest } from '@types';
import { ObjectId } from 'mongodb';
import { FindManyOptions, MongoRepository } from 'typeorm';
import {
  SaveTemporaryShareDto,
  ShareTopic,
  TemporaryShareDto,
} from './dto/temporary-share.dto';
import { TemporaryShare } from './entity/temporary-share.entity';

@Injectable()
export class TemporaryShareService extends BaseService<TemporaryShare> {
  constructor(
    @InjectRepository(TemporaryShare)
    private readonly shareRepository: MongoRepository<TemporaryShare>,
    private readonly topicService: TopicService,
    private readonly configService: AppConfigService,
    private readonly emailService: EmailService,
    private readonly twilioService: TwilioService,
    private readonly log: LogService,
  ) {
    super(shareRepository, TemporaryShare.name);
    this.log.setContext(TemporaryShareService.name);
  }

  async getAll(profile: Profile, pageRequest: TemporarySharePageRequest) {
    const { page, size, skip, order, orderBy, isGetExpiredLink } = pageRequest;
    const filter: FindManyOptions<TemporaryShare> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        isExpired: isGetExpiredLink,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [temporaryShares, count] = await this.findAndCount(filter);

    const topics = await this.topicService.getAllTopicsOfProfile(profile);

    return new Pageable(
      temporaryShares.map((e) => this.toDto(topics, e)),
      { size, page, count },
    );
  }

  toDto(topics: Topic[], temporaryShare: TemporaryShare) {
    const temporaryShareDto = new TemporaryShareDto(temporaryShare);
    const temporaryShareTopicIds = temporaryShare?.topics.map((topic) =>
      topic.toString(),
    );
    temporaryShareDto.topics = topics.map(
      (topic) =>
        new ShareTopic({
          _id: topic._id,
          title: topic.title,
          isShare: temporaryShareTopicIds.includes(topic._id.toString()),
        }),
    );
    return temporaryShareDto;
  }

  async saveTemporaryShare(
    profile: Profile,
    payload: SaveTemporaryShareDto,
    id?: ObjectId,
  ) {
    let share: TemporaryShare;
    const { topics, ...dto } = payload;

    if (id) {
      share = await this.findById(id);
      if (!share)
        throw new NotFoundException(`Temporary share ${id} does not exist`);
      share = Object.assign(share, dto);
    } else {
      share = this.create(dto);
      share.profile = profile._id;
    }

    if (payload.topics) {
      const topicsOfProfile =
        await this.topicService.getAllTopicsOfProfile(profile);
      const topicIdsOfProfile = topicsOfProfile.map((topic) =>
        topic._id.toString(),
      );
      const payloadTopicIds = payload.topics
        .filter((topic) => topic.isShared)
        .map((topic) => topic._id);
      const isValidTopicIds = payloadTopicIds.every((id) =>
        topicIdsOfProfile.includes(id.toString()),
      );

      if (!isValidTopicIds)
        throw new BadRequestException('Temporary share have invalid topic id');

      share.topics = payloadTopicIds;
    }

    return await this.save(share);
  }

  async shareTemporaryShare(profile: Profile, payload: SaveTemporaryShareDto) {
    const temporaryShare = await this.saveTemporaryShare(profile, payload);
    this.sendTemporaryShareLink(temporaryShare);
    return temporaryShare;
  }

  async sendTemporaryShareLink(temporaryShare: TemporaryShare) {
    const link = `${this.configService.frontEndUrl()}/${temporaryShare._id}`;

    switch (temporaryShare.inviteType) {
      case InviteType.EMAIL:
        this.emailService.send(
          temporaryShare.email,
          'Kith & Kin profile share',
          `<h3>Welcome to Kith and Kin!</h3>
        <p>You have been shared profile: ${link}</p>`,
        );
        break;
      case InviteType.SMS:
        this.twilioService.send(
          temporaryShare.phoneNumber,
          `Profile share: ${link}`,
        );
        break;
      default:
        throw new NotFoundException(
          `Unknown invite type ${temporaryShare.inviteType}`,
        );
    }
  }
}
