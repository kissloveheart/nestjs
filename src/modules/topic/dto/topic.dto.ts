import { PartialType } from '@nestjs/swagger';
import { Topic } from '../entity/topic.entity';

export class TopicCreateDto extends PartialType(Topic) {}

export class TopicDtoUpdateDto extends PartialType(TopicCreateDto) {}
