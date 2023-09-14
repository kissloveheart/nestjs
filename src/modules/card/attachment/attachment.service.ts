import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { AttachmentDto, SyncAttachmentDto } from '../dto/attachment.dto';
import { Attachment } from '../entity/child-entity/attachment.entity';

@Injectable()
export class AttachmentService extends BaseService<Attachment> {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: MongoRepository<Attachment>,
    private readonly log: LogService,
  ) {
    super(attachmentRepository, Attachment.name);
    this.log.setContext(AttachmentService.name);
  }

  async saveAttachment(
    profile: Profile,
    payload: AttachmentDto,
    id?: ObjectId,
  ) {
    let attachment = id
      ? await this.findOneCardWithDeletedTimeNull(
          profile._id,
          id,
          CardType.ATTACHMENTS,
        )
      : null;
    if (!attachment) {
      attachment = this.create(payload);
      attachment.profile = profile._id;
      attachment.cardType = CardType.ATTACHMENTS;
    }

    const data = await this.save({ ...attachment, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Attachment> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.ATTACHMENTS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [notes, count] = await this.findAndCount(filter);
    return new Pageable(notes, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Attachment> | FilterOperators<Attachment> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.ATTACHMENTS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [attachments, count] = await this.findAndCountMongo(filter);
    const syncAttachment = attachments.map(
      (attachment) => new SyncAttachmentDto(attachment),
    );
    return new Pageable(syncAttachment, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const attachment = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.ATTACHMENTS,
    );
    if (!attachment)
      throw new NotFoundException(`Attachment ${id.toString()} does not exist`);
    return attachment;
  }
}
