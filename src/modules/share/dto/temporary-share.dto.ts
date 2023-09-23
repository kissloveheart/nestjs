import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { booleanTransform, objectIdTransform } from '@transform';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  NotEquals,
  ValidateIf,
  ValidateNested,
  length,
} from 'class-validator';
import { ObjectId } from 'typeorm';
import { TemporaryShare } from '../entity/temporary-share.entity';

export class ShareTopic {
  @ApiProperty({ type: String })
  @Type(() => ObjectId)
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  @Transform(({ value }) => objectIdTransform(value), { toClassOnly: true })
  @NotEquals(null)
  _id: ObjectId;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  isShared: boolean;

  @ApiPropertyOptional()
  title?: string;

  constructor(partial: unknown) {
    Object.assign(this, partial);
  }
}

export class TemporaryShareDto extends OmitType(TemporaryShare, ['topics']) {
  @ApiPropertyOptional({ type: ShareTopic, isArray: true })
  @Type(() => ShareTopic)
  topics: ShareTopic[];

  constructor(partial: Partial<TemporaryShare>) {
    super();
    Object.assign(this, partial);
  }
}
export class SaveTemporaryShareDto extends OmitType(TemporaryShare, [
  '_id',
  'profile',
  'isExpired',
  'topics',
]) {
  @ApiPropertyOptional({ type: ShareTopic, isArray: true })
  @Type(() => ShareTopic)
  @ValidateNested({ each: true })
  @IsArray()
  @ValidateIf(({ value }) => value && value.length > 0)
  topics: ShareTopic[];
}
