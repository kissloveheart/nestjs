import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Practitioner } from '../entity/child-entity/practitioner.entity';

export class SavePractitionerDto extends OmitType(Practitioner, [
  'topics',
  'profile',
  'cardType',
  'attachments',
] as const) {}

export class SyncPractitionerDto extends OmitType(Practitioner, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Practitioner>) {
    super();
    Object.assign(this, partial);
  }
}
