import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Allergy } from '../entity/child-entity/allergy.entity';

export class AllergyDto extends OmitType(Allergy, [
  'topics',
  'profile',
  'cardType',
  'practitioner',
] as const) {}

export class SyncAllergyDto extends OmitType(Allergy, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Allergy>) {
    super();
    Object.assign(this, partial);
  }
}
