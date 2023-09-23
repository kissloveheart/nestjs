import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { Medication } from '../entity/child-entity/medication.entity';
import {
  MedicationDto,
  SaveMedicationDto,
  SyncMedicationDto,
} from '../dto/medication.dto';
import { TopicService } from '../../topic/topic.service';
import { Topic, TopicPayload } from '@modules/topic';

@Injectable()
export class MedicationService extends BaseService<Medication> {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: MongoRepository<Medication>,
    private readonly log: LogService,
    private readonly topicService: TopicService,
  ) {
    super(medicationRepository, Medication.name);
    this.log.setContext(MedicationService.name);
  }

  async saveMedication(
    profile: Profile,
    payload: SaveMedicationDto,
    id?: ObjectId,
  ) {
    let medication: Medication;
    if (id) {
      medication = await this.findOneCardWithDeletedTimeNull(
        profile._id,
        id,
        CardType.MEDICATIONS,
      );
      delete payload._id;
      if (!medication)
        throw new BadRequestException(
          `Medication ${id.toString()} does not exist`,
        );
    } else {
      if (payload?._id) {
        const existMedication = await this.findOneCardWithDeletedTimeNull(
          profile._id,
          payload._id,
          CardType.MEDICATIONS,
        );
        if (existMedication)
          throw new ConflictException(
            `Medication ${payload._id} already exist`,
          );
      }
      medication = this.create(payload);
      medication.profile = profile._id;
      medication.cardType = CardType.MEDICATIONS;
    }

    const data = await this.save({ ...medication, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Medication> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.MEDICATIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [medications, count] = await this.findAndCount(filter);
    return new Pageable(medications, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Medication> | FilterOperators<Medication> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.MEDICATIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [medications, count] = await this.findAndCountMongo(filter);
    const syncMedications = medications.map(
      (medication) => new SyncMedicationDto(medication),
    );
    return new Pageable(syncMedications, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const cursor = await this.aggregate([
      {
        $match: {
          _id: id,
          profile: profile._id,
          cardType: CardType.MEDICATIONS,
          deletedTime: null,
        },
      },
      {
        $lookup: {
          from: 'topic',
          localField: 'topics',
          foreignField: '_id',
          as: 'topics',
        },
      },
    ]);

    if (!(await cursor.hasNext()))
      throw new NotFoundException(`Medication ${id.toString()} does not exist`);
    const medication = await cursor.next();
    const medicationDto = new MedicationDto(medication);
    return medicationDto;
  }

  async updateMedicationTopics(
    profile: Profile,
    id: ObjectId,
    payload: TopicPayload,
  ) {
    const medication = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.MEDICATIONS,
    );

    if (!medication) {
      throw new NotFoundException(`Medication ${id.toString()} does not exist`);
    }

    if (payload.topics) {
      const topicsOfProfile =
        await this.topicService.getAllTopicsOfProfile(profile);
      const topicIdsOfProfile = topicsOfProfile.map((topic) =>
        topic._id.toString(),
      );

      const payloadTopicIds = payload.topics.map((topic) => topic._id);
      const isValidTopicIds = payloadTopicIds.every((id) =>
        topicIdsOfProfile.includes(id.toString()),
      );
      if (!isValidTopicIds) {
        throw new BadRequestException(
          'Temporary medication have invalid topic id',
        );
      }
      const topics: Topic[] = topicsOfProfile.map((topic) => ({
        ...topic,
        isLinked: payloadTopicIds.some((id) => id.equals(topic._id)),
      }));
      medication.topics = payloadTopicIds;
      this.topicService.saveAll(topics);
    }
    await this.save(medication);
    return this.getOne(profile, id);
  }
}
