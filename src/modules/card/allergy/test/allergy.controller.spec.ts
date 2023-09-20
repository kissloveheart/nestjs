import { ClsService } from 'nestjs-cls';
import { AllergyController } from '../allergy.controller';
import { AllergyService } from '../allergy.service';
import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './allergy.mock';
import { PROFILE_TOKEN } from '@constant';
import { NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Allergy } from '@modules/card/entity/child-entity/allergy.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllergyDto, SyncAllergyDto } from '@modules/card/dto/allergy.dto';
import { Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { closeMongoConnection, initialTypeOrm } from '@test';
import { CardType } from '@enum';

describe('AllergyController', () => {
  let allergyController: AllergyController;
  let allergyService: AllergyService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Allergy])],
      controllers: [AllergyController],
      providers: [AllergyService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    allergyController = module.get<AllergyController>(AllergyController);
    allergyService = module.get<AllergyService>(AllergyService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(allergyService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of allergies', async () => {
      const mockAllergies = [new Allergy(), new Allergy()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      allergyService.getAll = jest.fn().mockReturnValue(mockAllergies);

      const result = await allergyController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(allergyService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockAllergies);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced allergies', async () => {
      const mockSyncedAllergies: SyncAllergyDto[] = [
        new SyncAllergyDto(new Allergy()),
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

      jest.spyOn(allergyService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedAllergies, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedAllergies.length,
        }),
      );

      const result = await allergyController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an allergy by ID', async () => {
      const mockAllergyId = new ObjectId();
      const mockAllergy = new Allergy();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(allergyService, 'getOne').mockResolvedValue(mockAllergy);
      const result = await allergyController.getOneById(mockAllergyId);
      expect(result).toEqual(mockAllergy);
    });

    it('should throw NotFoundException when allergy is not found', async () => {
      const mockAllergyId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(allergyService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(allergyService, 'getOne').mockResolvedValue(null);

      try {
        await allergyController.getOneById(mockAllergyId);
      } catch (error) {
        console.log(error);
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Allergy ${mockAllergyId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create allergy', () => {
    it('should create an allergy', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockAllergy = new Allergy();
      jest.spyOn(allergyService, 'saveAllergy').mockResolvedValue(mockAllergy);
      const payload = new AllergyDto({ name: 'allergy' });
      const result = await allergyController.createAllergy(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(allergyService.saveAllergy).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockAllergy);
    });
  });

  describe('Update allergy', () => {
    it('should update an allergy', async () => {
      const objectId = new ObjectId();
      const mockAllergy = new Allergy();
      mockAllergy.isNoLongerExperiencing = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(allergyService, 'saveAllergy').mockResolvedValue(mockAllergy);
      const payload = new AllergyDto({
        isNoLongerExperiencing: false,
      });
      const result = await allergyController.updateAllergy(objectId, payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(allergyService.saveAllergy).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete allergy by Id', () => {
    it('should soft delete an allergy', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(allergyService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Allergy()));
      allergyService.softDeleteCard = jest.fn();
      await allergyController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(allergyService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.ALLERGIES,
      );
    });
  });
});
