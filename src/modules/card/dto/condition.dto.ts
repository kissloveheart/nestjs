import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Condition } from '../entity/child-entity/condition.entity';

export class SaveConditionDto extends OmitType(Condition, [
  'topics',
  'profile',
  'cardType',
  'practitioner',
] as const) {}

export class SyncConditionDto extends OmitType(Condition, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Condition>) {
    super();
    Object.assign(this, partial);
  }
}
