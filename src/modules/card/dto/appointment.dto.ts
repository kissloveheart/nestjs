import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Appointment } from '../entity/child-entity/appointment.entity';

export class SaveAppointmentDto extends OmitType(Appointment, [
  'topics',
  'profile',
  'cardType',
  'practitioner',
] as const) {}

export class SyncAppointmentDto extends OmitType(Appointment, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Appointment>) {
    super();
    Object.assign(this, partial);
  }
}
