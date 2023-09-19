import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Question } from '../entity/child-entity/question.entity';

export class SaveQuestionDto extends OmitType(Question, [
  'topics',
  'profile',
  'cardType',
  'practitioner',
  'appointment',
  'attachments',
] as const) {}

export class SyncQuestionDto extends OmitType(Question, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Question>) {
    super();
    Object.assign(this, partial);
  }
}
