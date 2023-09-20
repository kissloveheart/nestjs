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
import { MedicationController } from '../medication.controller';
import { MedicationService } from '../medication.service';
import { Medication } from '@modules/card/entity/child-entity/medication.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './medication.mock';
import {
  SaveMedicationDto,
  SyncMedicationDto,
} from '@modules/card/dto/medication.dto';

describe('MedicationController', () => {
  let medicationController: MedicationController;
  let medicationService: MedicationService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Medication]),
      ],
      controllers: [MedicationController],
      providers: [MedicationService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    medicationController =
      module.get<MedicationController>(MedicationController);
    medicationService = module.get<MedicationService>(MedicationService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(medicationService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of medications', async () => {
      const mockMedication = [new Medication(), new Medication()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      medicationService.getAll = jest.fn().mockReturnValue(mockMedication);

      const result = await medicationController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(medicationService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockMedication);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced medication', async () => {
      const mockSyncMedication: SyncMedicationDto[] = [
        new SyncMedicationDto(new Medication()),
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
            activelyTaking: false,
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(medicationService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncMedication, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncMedication.length,
        }),
      );

      const result = await medicationController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an medication by ID', async () => {
      const mockMedicationId = new ObjectId();
      const mockMedication = new Medication();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(medicationService, 'getOne').mockResolvedValue(mockMedication);
      const result = await medicationController.getOneById(mockMedicationId);
      expect(result).toEqual(mockMedication);
    });

    it('should throw NotFoundException when medication is not found', async () => {
      const mockMedicationId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(medicationService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(medicationService, 'getOne').mockResolvedValue(null);

      try {
        await medicationController.getOneById(mockMedicationId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Medication ${mockMedicationId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create medication', () => {
    it('should create an medication', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockMedication = new Medication();
      jest
        .spyOn(medicationService, 'saveMedication')
        .mockResolvedValue(mockMedication);
      const payload = new SaveMedicationDto();
      const result = await medicationController.createMedication(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(medicationService.saveMedication).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockMedication);
    });
  });

  describe('Update medication', () => {
    it('should update an medication', async () => {
      const objectId = new ObjectId();
      const mockMedication = new Medication();
      mockMedication.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(medicationService, 'saveMedication')
        .mockResolvedValue(mockMedication);
      const payload = new SaveMedicationDto({
        isNoLongerExperiencing: false,
      });
      const result = await medicationController.updateMedication(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(medicationService.saveMedication).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete medication by Id', () => {
    it('should soft delete an medication', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(medicationService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Medication()));
      medicationService.softDeleteCard = jest.fn();
      await medicationController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(medicationService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.MEDICATIONS,
      );
    });
  });
});
