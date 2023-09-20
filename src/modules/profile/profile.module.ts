import { CardModule } from '@modules/card';
import { FileModule } from '@modules/file';
import { TopicModule } from '@modules/topic';
import { Global, Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entity/profile.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    FileModule,
    TopicModule,
    forwardRef(() => CardModule),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
