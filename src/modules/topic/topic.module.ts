import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entity/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { ProfileModule } from '@modules/profile';

@Module({
  imports: [TypeOrmModule.forFeature([Topic]), ProfileModule],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
