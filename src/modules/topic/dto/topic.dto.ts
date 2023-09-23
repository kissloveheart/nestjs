import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Topic } from '../entity/topic.entity';
import { IsArray, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class TopicCreateDto extends PartialType(Topic) {}

export class TopicDtoUpdateDto extends PartialType(TopicCreateDto) {}

export class SyncTopicDto extends OmitType(Topic, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Topic>) {
    super();
    Object.assign(this, partial);
  }
}

export class TopicPayload {
  @ApiPropertyOptional({ type: Topic, isArray: true })
  @Type(() => Topic)
  @ValidateNested({ each: true })
  @IsArray()
  @ValidateIf(({ value }) => value && value.length > 0)
  topics: Topic[];
}
