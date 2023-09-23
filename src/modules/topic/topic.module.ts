import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entity/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { ProfileModule } from '@modules/profile';

@Module({
  imports: [TypeOrmModule.forFeature([Topic]), forwardRef(() => ProfileModule)],
  controllers: [TopicController],
  providers: [TopicService],
  exports: [TopicService],
})
export class TopicModule {}
