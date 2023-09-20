import { CardType } from '@enum';
import { LogService } from '@log';
import { FileService } from '@modules/file';
import { Profile } from '@modules/profile';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
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
    let attachment: Attachment;
    if (id) {
      attachment = await this.findOneCardWithDeletedTimeNull(
        profile._id,
        id,
        CardType.ATTACHMENTS,
      );
      delete payload._id;
      if (!attachment)
        throw new BadRequestException(
          `Attachment ${id.toString()} does not exist`,
        );
    } else {
      if (payload?._id) {
        const existAttachment = await this.findOneCardWithDeletedTimeNull(
          profile._id,
          payload._id,
          CardType.ATTACHMENTS,
        );
        if (existAttachment)
          throw new ConflictException(
            `Attachment ${payload._id} already exist`,
          );
      }
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

    return new AttachmentDto(await cursor.next());
  }
}
