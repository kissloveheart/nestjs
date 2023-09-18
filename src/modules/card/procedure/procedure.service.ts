import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';

import { Procedure } from '../entity/child-entity/procedure.entity';
import { SaveProcedureDto, SyncProcedureDto } from '../dto/procedure.dto';

@Injectable()
export class ProcedureService extends BaseService<Procedure> {
  constructor(
    @InjectRepository(Procedure)
    private readonly procedureRepository: MongoRepository<Procedure>,
    private readonly log: LogService,
  ) {
    super(procedureRepository, Procedure.name);
    this.log.setContext(ProcedureService.name);
  }

  async saveProcedure(
    profile: Profile,
    payload: SaveProcedureDto,
    id?: ObjectId,
  ) {
    let procedure = id
      ? await this.findOneCardWithDeletedTimeNull(
          profile._id,
          id,
          CardType.PROCEDURES,
        )
      : null;
    if (!procedure) {
      procedure = this.create(payload);
      procedure.profile = profile._id;
      procedure.cardType = CardType.PROCEDURES;
    }

    const data = await this.save({ ...procedure, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Procedure> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.PROCEDURES,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [procedures, count] = await this.findAndCount(filter);
    return new Pageable(procedures, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Procedure> | FilterOperators<Procedure> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.PROCEDURES,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [procedures, count] = await this.findAndCountMongo(filter);
    const syncProcedures = procedures.map(
      (procedure) => new SyncProcedureDto(procedure),
    );
    return new Pageable(syncProcedures, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const procedure = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.PROCEDURES,
    );
    if (!procedure)
      throw new NotFoundException(`Procedure ${id.toString()} does not exist`);
    return procedure;
  }
}
