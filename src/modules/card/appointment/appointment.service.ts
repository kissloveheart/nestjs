import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { Appointment } from '../entity/child-entity/appointment.entity';
import { AppointmentDto, SyncAppointmentDto } from '../dto/appointment.dto';

@Injectable()
export class AppointmentService extends BaseService<Appointment> {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: MongoRepository<Appointment>,
    private readonly log: LogService,
  ) {
    super(appointmentRepository, Appointment.name);
    this.log.setContext(AppointmentService.name);
  }

  async saveAppointment(
    profile: Profile,
    payload: AppointmentDto,
    id?: ObjectId,
  ) {
    let appointment = id
      ? await this.findOneCardWithDeletedTimeNull(
          profile._id,
          id,
          CardType.APPOINTMENTS,
        )
      : null;
    if (!appointment) {
      appointment = this.create(payload);
      appointment.profile = profile._id;
      appointment.cardType = CardType.APPOINTMENTS;
    }

    const data = await this.save({ ...appointment, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Appointment> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.APPOINTMENTS,
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
    const filter: FindManyOptions<Appointment> | FilterOperators<Appointment> =
      {
        where: {
          updatedTime: { $gt: lastSyncTime },
          profile: profile._id,
          cardType: CardType.APPOINTMENTS,
        },
        take: size,
        skip,
        order: { [orderBy]: order },
      };

    const [appointment, count] = await this.findAnfCountMongo(filter);
    const syncAppointment = appointment.map(
      (appointment) => new SyncAppointmentDto(appointment),
    );
    return new Pageable(syncAppointment, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const appointment = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.APPOINTMENTS,
    );
    if (!appointment)
      throw new NotFoundException(
        `Appointment ${id.toString()} does not exist`,
      );
    return appointment;
  }
}
