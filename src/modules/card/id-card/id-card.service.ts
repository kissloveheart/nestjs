import { CardType } from '@enum';
import { LogService } from '@log';
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

import { IDCard } from '../entity/child-entity/idCard.entity';
import { SaveIDCardDto, SyncIDCardDto } from '../dto/id-card.dto';

@Injectable()
export class IDCardService extends BaseService<IDCard> {
  constructor(
    @InjectRepository(IDCard)
    private readonly idCardRepository: MongoRepository<IDCard>,
    private readonly log: LogService,
  ) {
    super(idCardRepository, IDCard.name);
    this.log.setContext(IDCardService.name);
  }

  async saveIDCard(profile: Profile, payload: SaveIDCardDto, id?: ObjectId) {
    let idCard: IDCard;
    if (id) {
      idCard = await this.findOneCardWithDeletedTimeNull(
        profile._id,
        id,
        CardType.ID_CARD,
      );
      delete payload._id;
      if (!idCard)
        throw new BadRequestException(`IDCard ${id.toString()} does not exist`);
    } else {
      if (payload?._id) {
        const existIDCard = await this.findOneCardWithDeletedTimeNull(
          profile._id,
          payload._id,
          CardType.ID_CARD,
        );
        if (existIDCard)
          throw new ConflictException(`IDCard ${payload._id} already exist`);
      }
      idCard = this.create(payload);
      idCard.profile = profile._id;
      idCard.cardType = CardType.ID_CARD;
    }

    const data = await this.save({ ...idCard, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<IDCard> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.ID_CARD,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [idCards, count] = await this.findAndCount(filter);
    return new Pageable(idCards, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<IDCard> | FilterOperators<IDCard> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.ID_CARD,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [idCards, count] = await this.findAndCountMongo(filter);
    const syncIDCards = idCards.map((idCard) => new SyncIDCardDto(idCard));
    return new Pageable(syncIDCards, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const idCard = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.ID_CARD,
    );
    if (!idCard)
      throw new NotFoundException(`IDCard ${id.toString()} does not exist`);
    return idCard;
  }
}
