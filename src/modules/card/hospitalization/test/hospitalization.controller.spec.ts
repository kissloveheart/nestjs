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
import { HospitalizationController } from '../hospitalization.controller';
import { HospitalizationService } from '../hospitalization.service';
import { Hospitalization } from '@modules/card/entity/child-entity/hospitalization.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './hospitalization.mock';
import {
  SaveHospitalizationDto,
  SyncHospitalizationDto,
} from '@modules/card/dto/hospitalization.dto';

describe('HospitalizationController', () => {
  let hospitalizationController: HospitalizationController;
  let hospitalizationService: HospitalizationService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Hospitalization]),
      ],
      controllers: [HospitalizationController],
      providers: [HospitalizationService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    hospitalizationController = module.get<HospitalizationController>(
      HospitalizationController,
    );
    hospitalizationService = module.get<HospitalizationService>(
      HospitalizationService,
    );
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(hospitalizationService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of hospitalizations', async () => {
      const mockHospitalizations = [
        new Hospitalization(),
        new Hospitalization(),
      ];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      hospitalizationService.getAll = jest
        .fn()
        .mockReturnValue(mockHospitalizations);

      const result = await hospitalizationController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(hospitalizationService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockHospitalizations);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced hospitalizations', async () => {
      const mockSyncedHospitalizations: SyncHospitalizationDto[] = [
        new SyncHospitalizationDto(new Hospitalization()),
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
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(hospitalizationService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedHospitalizations, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedHospitalizations.length,
        }),
      );

      const result =
        await hospitalizationController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an hospitalization by ID', async () => {
      const mockHospitalizationId = new ObjectId();
      const mockHospitalization = new Hospitalization();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(hospitalizationService, 'getOne')
        .mockResolvedValue(mockHospitalization);
      const result = await hospitalizationController.getOneById(
        mockHospitalizationId,
      );
      expect(result).toEqual(mockHospitalization);
    });

    it('should throw NotFoundException when hospitalization is not found', async () => {
      const mockHospitalizationId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(hospitalizationService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(hospitalizationService, 'getOne').mockResolvedValue(null);

      try {
        await hospitalizationController.getOneById(mockHospitalizationId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `hospitalization ${mockHospitalizationId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create hospitalization', () => {
    it('should create an hospitalization', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockHospitalization = new Hospitalization();
      jest
        .spyOn(hospitalizationService, 'saveHospitalization')
        .mockResolvedValue(mockHospitalization);
      const payload = new SaveHospitalizationDto();
      const result =
        await hospitalizationController.createHospitalization(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(hospitalizationService.saveHospitalization).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockHospitalization);
    });
  });

  describe('Update hospitalization', () => {
    it('should update an hospitalization', async () => {
      const objectId = new ObjectId();
      const mockHospitalization = new Hospitalization();
      mockHospitalization.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(hospitalizationService, 'saveHospitalization')
        .mockResolvedValue(mockHospitalization);
      const payload = new SaveHospitalizationDto({
        isNoLongerExperiencing: false,
      });
      const result = await hospitalizationController.updateHospitalization(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(hospitalizationService.saveHospitalization).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete hospitalization by Id', () => {
    it('should soft delete an hospitalization', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(hospitalizationService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Hospitalization()));
      hospitalizationService.softDeleteCard = jest.fn();
      await hospitalizationController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(hospitalizationService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.HOSPITALIZATIONS,
      );
    });
  });
});
