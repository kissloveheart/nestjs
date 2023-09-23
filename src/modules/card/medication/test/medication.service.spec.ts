import { DataSource, MongoRepository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { Pageable } from '@types';
import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CardType } from '@enum';
import { closeMongoConnection, initialTypeOrm } from '@test';
import { Medication } from '@modules/card/entity/child-entity/medication.entity';
import { MedicationService } from '../medication.service';
import {
  createMedicationPayload,
  medicationData,
  medicationPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  topicData,
  topicNotExistPayload,
  topicPayload,
} from './medication.mock';
import {
  LinkTopic,
  MedicationDto,
  SyncMedicationDto,
} from '@modules/card/dto/medication.dto';
import { Topic, TopicService } from '@modules/topic';

describe('medicationService', () => {
  let medicationService: MedicationService;
  let medicationRepository: MongoRepository<Medication>;
  let topicRepository: MongoRepository<Topic>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Medication, Topic]),
      ],
      providers: [MedicationService, TopicService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    medicationService = module.get<MedicationService>(MedicationService);
    medicationRepository = module.get(getRepositoryToken(Medication));
    topicRepository = module.get(getRepositoryToken(Topic));
    await dataSource.getMongoRepository(Medication).insertMany(medicationData);
    await topicRepository.insert(topicData);

    jest.clearAllMocks();
  });

  afterEach(async () => {
    await medicationRepository.clear();
    await topicRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  describe('saveMedication', () => {
    it('should create and save a new medication when id is not provided', async () => {
      const countBefore = await medicationRepository.count();
      const result = await medicationService.saveMedication(
        mockProfile,
        createMedicationPayload,
      );
      const countAfter = await medicationRepository.count();
      expect(result._id).toEqual(createMedicationPayload._id);
      expect(result.isFollowedUp).toBe(createMedicationPayload.isFollowedUp);
      expect(result.instruction).toBe(createMedicationPayload.instruction);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but medication already exist', async () => {
      try {
        await medicationService.saveMedication(mockProfile, medicationPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Medication ${medicationPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing Medication when id is provided', async () => {
      const medicationId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await medicationService.saveMedication(
        mockProfile,
        medicationPayload,
        medicationId,
      );
      expect(result._id).toEqual(medicationId);
      expect(result.isFollowedUp).toEqual(medicationPayload.isFollowedUp);
      expect(result.instruction).toEqual(medicationPayload.instruction);
    });

    it('should throw BadRequestException when id is provided but medication does not exist', async () => {
      const mockMedicationId = new ObjectId();
      try {
        await medicationService.saveMedication(
          mockProfile,
          medicationPayload,
          mockMedicationId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Medication ${mockMedicationId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of medications', async () => {
      const medications = await medicationRepository.find();
      const count = await medicationRepository.count();

      const result = await medicationService.getAll(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toBeInstanceOf(Pageable);
      expect(result.itemCount).toBe(count);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getAllSync', () => {
    it('should return a Pageable of medication', async () => {
      const medications = await medicationRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.MEDICATIONS,
        },
      });
      const filteredMedications = medications.filter(
        (medication) =>
          medication.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await medicationService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncMedications = filteredMedications.map(
        (medication) => new SyncMedicationDto(medication),
      );
      expect(result.result).toEqual(syncMedications);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an medication if it exists', async () => {
      const mockMedicationId = new ObjectId('650156e338b8a56d37856604');
      const cursor = await medicationRepository.aggregate([
        {
          $match: {
            _id: mockMedicationId,
            profile: new ObjectId('650156e338b8a56d37856611'),
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

      const medication = await cursor.next();
      const newMedication = new MedicationDto(medication);
      const result = await medicationService.getOne(
        mockProfile,
        mockMedicationId,
      );

      expect(result).toEqual(newMedication);
    });

    it('should throw NotFoundException if medication does not exist', async () => {
      const mockMedicationId = new ObjectId();
      try {
        await medicationService.getOne(mockProfile, mockMedicationId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Medication ${mockMedicationId} does not exist`,
        );
      }
    });
  });

  describe('UpdateMedicationTopic', () => {
    it('should throw NotFoundException if medication does not exist', async () => {
      await expect(
        medicationService.updateMedicationTopics(
          mockProfile,
          new ObjectId(),
          topicPayload,
        ),
      ).rejects.toThrowError(NotFoundException);
    });

    it.skip('should throw BadRequestException if payload has invalid topic id', async () => {
      //TODO need to fix test
      await expect(
        medicationService.updateMedicationTopics(
          mockProfile,
          new ObjectId('6500113c1895a06e02ab3d87'),
          topicNotExistPayload,
        ),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
