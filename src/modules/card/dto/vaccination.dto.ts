import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Vaccination } from '../entity/child-entity/vaccination.entity';

export class SaveVaccinationDto extends OmitType(Vaccination, [
  '_id',
  'topics',
  'profile',
  'cardType',
  'practitioner',
  'appointment',
  'attachments',
] as const) {}

export class SyncVaccinationDto extends OmitType(Vaccination, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Vaccination>) {
    super();
    Object.assign(this, partial);
  }
}
