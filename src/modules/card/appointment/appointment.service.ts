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
import { Appointment } from '../entity/child-entity/appointment.entity';
import { SaveAppointmentDto, SyncAppointmentDto } from '../dto/appointment.dto';

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
    payload: SaveAppointmentDto,
    id?: ObjectId,
  ) {
    let appointment: Appointment;
    if (id) {
      appointment = await this.findOneCardWithDeletedTimeNull(
        profile._id,
        id,
        CardType.APPOINTMENTS,
      );
      delete payload._id;
      if (!appointment)
        throw new BadRequestException(
          `Appointment ${id.toString()} does not exist`,
        );
    } else {
      if (payload?._id) {
        const existAppointment = await this.findOneCardWithDeletedTimeNull(
          profile._id,
          payload._id,
          CardType.APPOINTMENTS,
        );
        if (existAppointment)
          throw new ConflictException(
            `Appointment ${payload._id} already exist`,
          );
      }
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

    const [appointments, count] = await this.findAndCountMongo(filter);
    const syncAppointment = appointments.map(
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
