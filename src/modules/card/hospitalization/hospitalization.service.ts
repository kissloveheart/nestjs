import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { Hospitalization } from '../entity/child-entity/hospitalization.entity';
import {
  HospitalizationDto,
  SyncHospitalizationDto,
} from '../dto/hospitalization.dto';

@Injectable()
export class HospitalizationService extends BaseService<Hospitalization> {
  constructor(
    @InjectRepository(Hospitalization)
    private readonly hospitalizationRepository: MongoRepository<Hospitalization>,
    private readonly log: LogService,
  ) {
    super(hospitalizationRepository, Hospitalization.name);
    this.log.setContext(HospitalizationService.name);
  }

  async saveHospitalization(
    profile: Profile,
    payload: HospitalizationDto,
    id?: ObjectId,
  ) {
    let hospitalization = id
      ? await this.findOneCardWithDeletedTimeNull(
          profile._id,
          id,
          CardType.HOSPITALIZATIONS,
        )
      : null;
    if (!hospitalization) {
      hospitalization = this.create(payload);
      hospitalization.profile = profile._id;
      hospitalization.cardType = CardType.HOSPITALIZATIONS;
    }

    const data = await this.save({ ...hospitalization, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Hospitalization> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.HOSPITALIZATIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [hospitalizations, count] = await this.findAndCount(filter);
    return new Pageable(hospitalizations, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter:
      | FindManyOptions<Hospitalization>
      | FilterOperators<Hospitalization> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.HOSPITALIZATIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [hospitalizations, count] = await this.findAndCountMongo(filter);
    const syncHospitalizations = hospitalizations.map(
      (hospitalization) => new SyncHospitalizationDto(hospitalization),
    );
    return new Pageable(syncHospitalizations, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const hospitalization = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.HOSPITALIZATIONS,
    );
    if (!hospitalization)
      throw new NotFoundException(
        `Hospitalization ${id.toString()} does not exist`,
      );
    return hospitalization;
  }
}
