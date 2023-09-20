import { ClsService } from 'nestjs-cls';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { PROFILE_TOKEN } from '@constant';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { closeMongoConnection, initialTypeOrm } from '@test';
import { CardType } from '@enum';
import { ConditionController } from '../condition.controller';
import { ConditionService } from '../condition.service';
import { Condition } from '@modules/card/entity/child-entity/condition.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './condition.mock';
import {
  SaveConditionDto,
  SyncConditionDto,
} from '@modules/card/dto/condition.dto';

describe('ConditionController', () => {
  let conditionController: ConditionController;
  let conditionService: ConditionService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Condition])],
      controllers: [ConditionController],
      providers: [ConditionService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    conditionController = module.get<ConditionController>(ConditionController);
    conditionService = module.get<ConditionService>(ConditionService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(conditionService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of conditions', async () => {
      const mockConditions = [new Condition(), new Condition()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      conditionService.getAll = jest.fn().mockReturnValue(mockConditions);

      const result = await conditionController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(conditionService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockConditions);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced conditions', async () => {
      const mockSyncedConditions: SyncConditionDto[] = [
        new SyncConditionDto(new Condition()),
      ];
      const mockExpectedPageable = {
        hasNextPage: false,
        hasPreviousPage: false,
        itemCount: 1,
        page: 1,
        pageCount: 1,
        result: [
          {
            __v: 0,
            deletedTime: null,
            isFollowedUp: false,
            isNoLongerExperiencing: false,
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(conditionService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedConditions, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedConditions.length,
        }),
      );

      const result = await conditionController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an condition by ID', async () => {
      const mockConditionId = new ObjectId();
      const mockCondition = new Condition();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(conditionService, 'getOne').mockResolvedValue(mockCondition);
      const result = await conditionController.getOneById(mockConditionId);
      expect(result).toEqual(mockCondition);
    });

    it('should throw NotFoundException when condition is not found', async () => {
      const mockConditionId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(conditionService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(conditionService, 'getOne').mockResolvedValue(null);

      try {
        await conditionController.getOneById(mockConditionId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Condition ${mockConditionId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create condition', () => {
    it('should create an condition', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockCondition = new Condition();
      jest
        .spyOn(conditionService, 'saveCondition')
        .mockResolvedValue(mockCondition);
      const payload = new SaveConditionDto();
      const result = await conditionController.createCondition(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(conditionService.saveCondition).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockCondition);
    });
  });

  describe('Update condition', () => {
    it('should update an condition', async () => {
      const objectId = new ObjectId();
      const mockCondition = new Condition();
      mockCondition.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(conditionService, 'saveCondition')
        .mockResolvedValue(mockCondition);
      const payload = new SaveConditionDto({
        isNoLongerExperiencing: false,
      });
      const result = await conditionController.updateCondition(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(conditionService.saveCondition).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete condition by Id', () => {
    it('should soft delete an condition', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(conditionService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Condition()));
      conditionService.softDeleteCard = jest.fn();
      await conditionController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(conditionService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.CONDITIONS,
      );
    });
  });
});
