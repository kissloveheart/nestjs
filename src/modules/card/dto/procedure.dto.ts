import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Procedure } from '../entity/child-entity/procedure.entity';

export class SaveProcedureDto extends OmitType(Procedure, [
  'topics',
  'profile',
  'cardType',
  'practitioner',
  'condition',
  'attachments',
] as const) {}

export class SyncProcedureDto extends OmitType(Procedure, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Procedure>) {
    super();
    Object.assign(this, partial);
  }
}
