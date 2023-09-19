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
import { AllergyDto, SyncAllergyDto } from '../dto/allergy.dto';
import { Allergy } from '../entity/child-entity/allergy.entity';

@Injectable()
export class AllergyService extends BaseService<Allergy> {
  constructor(
    @InjectRepository(Allergy)
    private readonly allergyRepository: MongoRepository<Allergy>,
    private readonly log: LogService,
  ) {
    super(allergyRepository, Allergy.name);
    this.log.setContext(AllergyService.name);
  }

  async saveAllergy(profile: Profile, payload: AllergyDto, id?: ObjectId) {
    let allergy: Allergy;
    if (id) {
      allergy = await this.findOneCardWithDeletedTimeNull(
        profile._id,
        id,
        CardType.ALLERGIES,
      );
      delete payload._id;
      if (!allergy)
        throw new BadRequestException(
          `Allergy ${id.toString()} does not exist`,
        );
    } else {
      if (payload?._id) {
        const existAllergy = await this.findOneCardWithDeletedTimeNull(
          profile._id,
          payload._id,
          CardType.ALLERGIES,
        );
        if (existAllergy)
          throw new ConflictException(`Allergy ${payload._id} already exist`);
      }
      allergy = this.create(payload);
      allergy.profile = profile._id;
      allergy.cardType = CardType.ALLERGIES;
    }

    const data = await this.save({ ...allergy, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Allergy> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.ALLERGIES,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [allergies, count] = await this.findAndCount(filter);
    return new Pageable(allergies, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Allergy> | FilterOperators<Allergy> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.ALLERGIES,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [allergies, count] = await this.findAndCountMongo(filter);
    const syncAllergies = allergies.map(
      (allergy) => new SyncAllergyDto(allergy),
    );
    return new Pageable(syncAllergies, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const allergy = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.ALLERGIES,
    );
    if (!allergy)
      throw new NotFoundException(`Allergy ${id.toString()} does not exist`);
    return allergy;
  }
}
