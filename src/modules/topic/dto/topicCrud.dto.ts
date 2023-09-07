import { PartialType } from '@nestjs/swagger';
import { Topic } from '../entity/Topic.entity';

export class TopicCreateDto extends PartialType(Topic) {}

export class TopicDtoUpdateDto extends PartialType(TopicCreateDto) {}
