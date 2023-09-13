import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Note } from '../entity/child-entity/note.entity';
import { Attachment } from '../entity/child-entity/attachment.entity';

export class AttachmentDto extends OmitType(Attachment, [
  'topics',
  'profile',
  'cardType',
] as const) {}

export class SyncAttachmentDto extends OmitType(Attachment, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Attachment>) {
    super();
    Object.assign(this, partial);
  }
}
