import { LogService } from '@log';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, Pageable } from '@types';
import { plainToInstance } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { FindManyOptions, MongoRepository } from 'typeorm';
import { ProfileDto } from './dto/profile.dto';
import { Profile } from './entity/Profile.entity';
import { FileService } from '@modules/file';
import { formatUrlBucket } from '@utils';

@Injectable()
export class ProfileService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: MongoRepository<Profile>,
    private readonly fileService: FileService,
    private readonly log: LogService,
  ) {
    super(profileRepository);
    this.log.setContext(ProfileService.name);
  }

  async getAll(pageRequest: PageRequest) {
    const { page, size, skip, search, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Profile> = {
      where: {
        deletedTime: null,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [profiles, count] = await this.findAndCount(filter);
    return new Pageable(profiles, { size, page, count });
  }

  async getOne(id: ObjectId) {
    const profile = await this.findOne({
      where: {
        _id: id,
        deletedTime: null,
      },
    });
    if (!profile)
      throw new NotFoundException(`Profile ${id.toString()} does not exist`);
    return profile;
  }

  async saveProfile(payload: ProfileDto, id?: ObjectId): Promise<Profile> {
    let profile = id ? await this.getOne(id) : null;
    if (!profile) {
      profile = this.create(payload);
    }

    profile = await this.save({ ...profile, ...payload });
    return plainToInstance(Profile, profile);
  }

  async softDelete(id: ObjectId) {
    const profile = await this.getOne(id);
    profile.deletedTime = new Date();
    await this.save(profile);
  }

  async changeAvatar(id: ObjectId, file: Express.Multer.File) {
    const profile = await this.getOne(id);
    const avatar = await this.fileService.upload(file, null, profile._id, true);
    profile.avatar = avatar.path;
    await this.save(profile);
    return formatUrlBucket(avatar.path);
  }
}
