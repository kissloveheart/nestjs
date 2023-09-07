import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { Profile } from './entity/Profile.entity';

@Injectable()
export class ProfileService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: MongoRepository<Profile>,
    private readonly log: LogService,
  ) {
    super(profileRepository);
    this.log.setContext(ProfileService.name);
  }
}
