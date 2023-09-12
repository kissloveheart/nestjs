import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './Profile.controller';
import { ProfileService } from './Profile.service';
import { Profile } from './entity/Profile.entity';
import { FileModule } from '@modules/file';

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), FileModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
