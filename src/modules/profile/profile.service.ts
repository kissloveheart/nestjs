import { LogService } from '@log';
import { FileService } from '@modules/file';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { formatUrlBucket } from '@utils';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { ProfileDto, SyncProfileDto } from './dto/profile.dto';
import { Profile } from './entity/Profile.entity';

@Injectable()
export class ProfileService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: MongoRepository<Profile>,
    private readonly fileService: FileService,
    private readonly log: LogService,
  ) {
    super(profileRepository, Profile.name);
    this.log.setContext(ProfileService.name);
  }

  async getAll(pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
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

  async getAllSync(pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Profile> | FilterOperators<Profile> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [profiles, count] = await this.findAnfCountMongo(filter);
    const profilesSyncDto = profiles.map(
      (profile) => new SyncProfileDto(profile),
    );
    return new Pageable(profilesSyncDto, { size, page, count });
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
    payload.emergencyContacts?.map((emergencyContact) => {
      if (!emergencyContact._id) {
        emergencyContact._id = new ObjectId();
      }
      return emergencyContact;
    });
    return await this.save({ ...profile, ...payload });
  }

  async changeAvatar(id: ObjectId, file: Express.Multer.File) {
    const profile = await this.getOne(id);
    const avatar = await this.fileService.upload(file, null, profile._id, true);
    profile.avatar = avatar.path;
    await this.save(profile);
    return formatUrlBucket(avatar.path);
  }
}
