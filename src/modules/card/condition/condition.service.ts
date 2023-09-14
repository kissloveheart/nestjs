import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { Condition } from '../entity/child-entity/condition.entity';
import { ConditionDto, SyncConditionDto } from '../dto/condition.dto';

@Injectable()
export class ConditionService extends BaseService<Condition> {
  constructor(
    @InjectRepository(Condition)
    private readonly conditionRepository: MongoRepository<Condition>,
    private readonly log: LogService,
  ) {
    super(conditionRepository, Condition.name);
    this.log.setContext(ConditionService.name);
  }

  async saveCondition(profile: Profile, payload: ConditionDto, id?: ObjectId) {
    let condition = id
      ? await this.findOneCardWithDeletedTimeNull(
          profile._id,
          id,
          CardType.CONDITIONS,
        )
      : null;
    if (!condition) {
      condition = this.create(payload);
      condition.profile = profile._id;
      condition.cardType = CardType.CONDITIONS;
    }

    const data = await this.save({ ...condition, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Condition> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.CONDITIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [conditions, count] = await this.findAndCount(filter);
    return new Pageable(conditions, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Condition> | FilterOperators<Condition> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.CONDITIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [conditions, count] = await this.findAndCountMongo(filter);
    const syncConditions = conditions.map(
      (condition) => new SyncConditionDto(condition),
    );
    return new Pageable(syncConditions, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const condition = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.CONDITIONS,
    );
    if (!condition)
      throw new NotFoundException(`Condition ${id.toString()} does not exist`);
    return condition;
  }
}
