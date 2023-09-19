import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Medication } from '../entity/child-entity/medication.entity';

export class SaveMedicationDto extends OmitType(Medication, [
  'topics',
  'profile',
  'cardType',
  'attachments',
  'prescription',
] as const) {}

export class SyncMedicationDto extends OmitType(Medication, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Medication>) {
    super();
    Object.assign(this, partial);
  }
}
