import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Topic } from '../entity/topic.entity';

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
