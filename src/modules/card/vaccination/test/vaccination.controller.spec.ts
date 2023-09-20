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
import { VaccinationController } from '../vaccination.controller';
import { VaccinationService } from '../vaccination.service';
import { Vaccination } from '@modules/card/entity/child-entity/vaccination.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './vaccination.mock';
import {
  SaveVaccinationDto,
  SyncVaccinationDto,
} from '@modules/card/dto/vaccination.dto';

describe('VaccinationController', () => {
  let vaccinationController: VaccinationController;
  let vaccinationService: VaccinationService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Vaccination]),
      ],
      controllers: [VaccinationController],
      providers: [VaccinationService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    vaccinationController = module.get<VaccinationController>(
      VaccinationController,
    );
    vaccinationService = module.get<VaccinationService>(VaccinationService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(vaccinationService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of vaccinations', async () => {
      const mockVaccinations = [new Vaccination(), new Vaccination()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      vaccinationService.getAll = jest.fn().mockReturnValue(mockVaccinations);

      const result = await vaccinationController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(vaccinationService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockVaccinations);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced vaccinations', async () => {
      const mockSyncedVaccinations: SyncVaccinationDto[] = [
        new SyncVaccinationDto(new Vaccination()),
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

      jest.spyOn(vaccinationService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedVaccinations, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedVaccinations.length,
        }),
      );

      const result =
        await vaccinationController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an vaccination by ID', async () => {
      const mockVaccinationId = new ObjectId();
      const mockVaccination = new Vaccination();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(vaccinationService, 'getOne')
        .mockResolvedValue(mockVaccination);
      const result = await vaccinationController.getOneById(mockVaccinationId);
      expect(result).toEqual(mockVaccination);
    });

    it('should throw NotFoundException when vaccination is not found', async () => {
      const mockVaccinationId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(vaccinationService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(vaccinationService, 'getOne').mockResolvedValue(null);

      try {
        await vaccinationController.getOneById(mockVaccinationId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Vaccination ${mockVaccinationId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create vaccination', () => {
    it('should create an vaccination', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockVaccination = new Vaccination();
      jest
        .spyOn(vaccinationService, 'saveVaccination')
        .mockResolvedValue(mockVaccination);
      const payload = new SaveVaccinationDto();
      const result = await vaccinationController.createVaccination(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(vaccinationService.saveVaccination).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockVaccination);
    });
  });

  describe('Update vaccination', () => {
    it('should update an vaccination', async () => {
      const objectId = new ObjectId();
      const mockVaccination = new Vaccination();
      mockVaccination.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(vaccinationService, 'saveVaccination')
        .mockResolvedValue(mockVaccination);
      const payload = new SaveVaccinationDto();
      const result = await vaccinationController.updateVaccination(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(vaccinationService.saveVaccination).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete vaccination by Id', () => {
    it('should soft delete an vaccination', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(vaccinationService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Vaccination()));
      vaccinationService.softDeleteCard = jest.fn();
      await vaccinationController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(vaccinationService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.VACCINATIONS,
      );
    });
  });
});
