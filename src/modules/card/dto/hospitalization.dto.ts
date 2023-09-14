import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Hospitalization } from '../entity/child-entity/hospitalization.entity';

export class HospitalizationDto extends OmitType(Hospitalization, [
  'topics',
  'profile',
  'cardType',
  'practitioner',
  'attachments',
  'condition',
] as const) {}

export class SyncHospitalizationDto extends OmitType(Hospitalization, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Hospitalization>) {
    super();
    Object.assign(this, partial);
  }
}
