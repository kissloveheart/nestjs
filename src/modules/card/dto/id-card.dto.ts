import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IDCard } from '../entity/child-entity/idCard.entity';

export class SaveIDCardDto extends OmitType(IDCard, [
  'topics',
  'profile',
  'cardType',
  'attachments',
] as const) {}

export class SyncIDCardDto extends OmitType(IDCard, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<IDCard>) {
    super();
    Object.assign(this, partial);
  }
}
