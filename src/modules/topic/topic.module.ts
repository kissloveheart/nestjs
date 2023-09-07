import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicController } from './Topic.controller';
import { TopicService } from './Topic.service';
import { Topic } from './entity/Topic.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
