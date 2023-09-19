import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Attachment } from '../entity/child-entity/attachment.entity';
import { File } from '@modules/file';
import { Type } from 'class-transformer';

export class AttachmentDto extends OmitType(Attachment, [
  'topics',
  'profile',
  'files',
  'endTime',
] as const) {
  @ApiProperty({ type: File, isArray: true })
  @Type(() => File)
  files: File[] = [];

  constructor(partial: unknown) {
    super();
    Object.assign(this, partial);
  }
}

export class SaveAttachmentDto extends OmitType(Attachment, [
  'topics',
  'profile',
  'cardType',
  'files',
  'endTime',
] as const) {
  @ApiPropertyOptional({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  file?: Express.Multer.File;
}

export class SyncAttachmentDto extends OmitType(Attachment, [
  'updatedTime',
  'deletedTime',
  'endTime',
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
