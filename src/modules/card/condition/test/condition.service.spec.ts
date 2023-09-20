import { DataSource, Repository } from 'typeorm';
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
import { ConditionService } from '../condition.service';
import { Condition } from '@modules/card/entity/child-entity/condition.entity';
import {
  conditionData,
  conditionPayload,
  createConditionPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './condition.mock';
import { SyncConditionDto } from '@modules/card/dto/condition.dto';

describe('ConditionService', () => {
  let conditionService: ConditionService;
  let conditionRepository: Repository<Condition>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Condition])],
      providers: [ConditionService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    conditionService = module.get<ConditionService>(ConditionService);
    conditionRepository = module.get<Repository<Condition>>(
      getRepositoryToken(Condition),
    );
    await dataSource.getMongoRepository(Condition).insertMany(conditionData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await conditionRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(conditionService).toBeDefined();
  });

  describe('saveCondition', () => {
    it('should create and save a new condition when id is not provided', async () => {
      const countBefore = await conditionRepository.count();
      const result = await conditionService.saveCondition(
        mockProfile,
        createConditionPayload,
      );
      const countAfter = await conditionRepository.count();
      expect(result._id).toEqual(createConditionPayload._id);
      expect(result.isFollowedUp).toBe(createConditionPayload.isFollowedUp);
      expect(result.description).toBe(createConditionPayload.description);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but condition already exist', async () => {
      try {
        await conditionService.saveCondition(mockProfile, conditionPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Condition ${conditionPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing condition when id is provided', async () => {
      const conditionId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await conditionService.saveCondition(
        mockProfile,
        conditionPayload,
        conditionId,
      );
      expect(result._id).toEqual(conditionId);
      expect(result.isFollowedUp).toEqual(conditionPayload.isFollowedUp);
      expect(result.description).toEqual(conditionPayload.description);
    });

    it('should throw BadRequestException when id is provided but condition does not exist', async () => {
      const mockConditionId = new ObjectId();
      try {
        await conditionService.saveCondition(
          mockProfile,
          conditionPayload,
          mockConditionId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Condition ${mockConditionId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of conditions', async () => {
      const conditions = await conditionRepository.find();
      const count = await conditionRepository.count();

      const result = await conditionService.getAll(
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
    it('should return a Pageable of conditions', async () => {
      const conditions = await conditionRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.CONDITIONS,
        },
      });
      const filteredConditions = conditions.filter(
        (condition) =>
          condition.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await conditionService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncConditions = filteredConditions.map(
        (condition) => new SyncConditionDto(condition),
      );
      expect(result.result).toEqual(syncConditions);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an condition if it exists', async () => {
      const mockConditionId = new ObjectId('650156e338b8a56d37856604');

      const condition = await conditionRepository.findOne({
        where: {
          _id: mockConditionId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.CONDITIONS,
        },
      });

      const result = await conditionService.getOne(
        mockProfile,
        mockConditionId,
      );

      expect(result).toEqual(condition);
    });

    it('should throw NotFoundException if condition does not exist', async () => {
      const mockConditionId = new ObjectId();
      try {
        await conditionService.getOne(mockProfile, mockConditionId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Condition ${mockConditionId} does not exist`,
        );
      }
    });
  });
});
