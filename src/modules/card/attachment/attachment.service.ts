import { CardType } from '@enum';
import { LogService } from '@log';
import { FileService } from '@modules/file';
import { Profile } from '@modules/profile';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { plainToClass } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import {
  AttachmentDto,
  SaveAttachmentDto,
  SyncAttachmentDto,
} from '../dto/attachment.dto';
import { Attachment } from '../entity/child-entity/attachment.entity';

@Injectable()
export class AttachmentService extends BaseService<Attachment> {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: MongoRepository<Attachment>,
    private readonly fileService: FileService,
    private readonly log: LogService,
  ) {
    super(attachmentRepository, Attachment.name);
    this.log.setContext(AttachmentService.name);
  }

  async saveAttachment(
    profile: Profile,
    payload: SaveAttachmentDto,
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

    if (payload.file) {
      const file = await this.fileService.upload(
        payload.file,
        null,
        profile._id,
      );
      attachment.files = [...attachment.files, file._id];
      delete payload.file;
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
    const cursor = await this.aggregate([
      {
        $match: {
          _id: id,
          profile: profile._id,
          cardType: CardType.ATTACHMENTS,
          deletedTime: null,
        },
      },
      {
        $lookup: {
          from: 'file',
          localField: 'files',
          foreignField: '_id',
          as: 'files',
        },
      },
      {
        $unset: ['profile', 'user'],
      },
    ]);

    if (!(await cursor.hasNext()))
      throw new NotFoundException(`Attachment ${id.toString()} does not exist`);

    return plainToClass(AttachmentDto, await cursor.next());
  }
}
