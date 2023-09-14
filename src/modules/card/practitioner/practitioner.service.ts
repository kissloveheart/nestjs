import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { PractitionerDto, SyncPractitionerDto } from '../dto/practitioner.dto';
import { Practitioner } from '../entity/child-entity/practitioner.entity';

@Injectable()
export class PractitionerService extends BaseService<Practitioner> {
  constructor(
    @InjectRepository(Practitioner)
    private readonly practitionerRepository: MongoRepository<Practitioner>,
    private readonly log: LogService,
  ) {
    super(practitionerRepository, Practitioner.name);
    this.log.setContext(PractitionerService.name);
  }

  async savePractitioner(
    profile: Profile,
    payload: PractitionerDto,
    id?: ObjectId,
  ) {
    let practitioner = id
      ? await this.findOneCardWithDeletedTimeNull(
          profile._id,
          id,
          CardType.PRACTITIONERS,
        )
      : null;
    if (!practitioner) {
      practitioner = this.create(payload);
      practitioner.profile = profile._id;
      practitioner.cardType = CardType.PRACTITIONERS;
    }

    const data = await this.save({ ...practitioner, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Practitioner> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.PRACTITIONERS,
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
    const filter:
      | FindManyOptions<Practitioner>
      | FilterOperators<Practitioner> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.PRACTITIONERS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [practitioners, count] = await this.findAndCountMongo(filter);
    const syncPractitioners = practitioners.map(
      (practitioner) => new SyncPractitionerDto(practitioner),
    );
    return new Pageable(syncPractitioners, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const practitioner = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.PRACTITIONERS,
    );
    if (!practitioner)
      throw new NotFoundException(
        `Practitioner ${id.toString()} does not exist`,
      );
    return practitioner;
  }
}
