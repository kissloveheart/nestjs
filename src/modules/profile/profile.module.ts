import { CardModule } from '@modules/card';
import { FileModule } from '@modules/file';
import { TopicModule } from '@modules/topic';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entity/profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileStrategy } from './strategies/profile.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    FileModule,
    TopicModule,
    CardModule,
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileStrategy],
  exports: [ProfileService],
})
export class ProfileModule {}
