import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TopicService } from './topic.service';

@Controller('Topic')
@ApiTags('Topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}
}
