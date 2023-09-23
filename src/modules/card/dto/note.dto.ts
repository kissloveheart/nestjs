import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Note } from '../entity/child-entity/note.entity';

export class SaveNoteDto extends OmitType(Note, [
  'topics',
  'profile',
  'cardType',
  'attachments',
] as const) {}

export class SyncNoteDto extends OmitType(Note, [
  'updatedTime',
  'deletedTime',
  'createdTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  @ApiProperty()
  createdTime?: Date;

  constructor(partial: Partial<Note>) {
    super();
    Object.assign(this, partial);
  }
}
