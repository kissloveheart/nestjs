import { LogService } from '@log';
import { CardService } from '@modules/card';
import { FileService } from '@modules/file';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { SaveProfileDto, SyncProfileDto } from './dto/profile.dto';
import { Profile } from './entity/profile.entity';
import { User } from '@modules/user';
import { TopicService } from '@modules/topic';

@Injectable()
export class ProfileService extends BaseService<Profile> {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: MongoRepository<Profile>,
    private readonly fileService: FileService,
    private readonly cardService: CardService,
    private readonly topicService: TopicService,
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

    const [profiles, count] = await this.findAndCountMongo(filter);
    const profilesSyncDto = profiles.map(
      (profile) => new SyncProfileDto(profile),
    );
    return new Pageable(profilesSyncDto, { size, page, count });
  }

  async findProfileWithOutDeletedTimeNull(id: ObjectId) {
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

  async saveProfile(payload: SaveProfileDto, id?: ObjectId): Promise<Profile> {
    let profile: Profile;
    if (id) {
      profile = await this.findProfileWithOutDeletedTimeNull(id);
      delete payload._id;
    } else {
      if (payload?._id) {
        const existProfile = await this.findOne({
          where: {
            _id: payload._id,
            deletedTime: null,
          },
        });
        if (existProfile)
          throw new ConflictException(`Profile ${payload._id} already exist`);
      }
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
    const profile = await this.findProfileWithOutDeletedTimeNull(id);
    const avatar = await this.fileService.upload(file, null, profile._id, true);
    profile.avatar = avatar.url;
    await this.save(profile);
    return {
      url: avatar.url,
      fileName: avatar.name,
    };
  }

  async softDeleteProfile(user: User, id: ObjectId) {
    await this.softDelete(id);
    await Promise.all([
      this.cardService.softDeleteCardOfProfile(user?._id, id),
      this.topicService.softDeleteTopicOfProfile(user?._id, id),
    ]);
  }
}
