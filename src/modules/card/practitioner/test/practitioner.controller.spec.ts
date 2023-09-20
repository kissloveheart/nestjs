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
import { Practitioner } from '@modules/card/entity/child-entity/practitioner.entity';
import { PractitionerController } from '../practitioner.controller';
import { PractitionerService } from '../practitioner.service';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './practitioner.mock';
import {
  SavePractitionerDto,
  SyncPractitionerDto,
} from '@modules/card/dto/practitioner.dto';

describe('PractitionerController', () => {
  let practitionerController: PractitionerController;
  let practitionerService: PractitionerService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Practitioner]),
      ],
      controllers: [PractitionerController],
      providers: [PractitionerService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    practitionerController = module.get<PractitionerController>(
      PractitionerController,
    );
    practitionerService = module.get<PractitionerService>(PractitionerService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(practitionerService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of practitioners', async () => {
      const mockPractitioners = [new Practitioner(), new Practitioner()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      practitionerService.getAll = jest.fn().mockReturnValue(mockPractitioners);

      const result = await practitionerController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(practitionerService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockPractitioners);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced practitioners', async () => {
      const mockSyncedPractitioners: SyncPractitionerDto[] = [
        new SyncPractitionerDto(new Practitioner()),
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
            isNoLongerSeeing: false,
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(practitionerService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedPractitioners, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedPractitioners.length,
        }),
      );

      const result =
        await practitionerController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an practitioner by ID', async () => {
      const mockPractitionerId = new ObjectId();
      const mockPractitioner = new Practitioner();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(practitionerService, 'getOne')
        .mockResolvedValue(mockPractitioner);
      const result =
        await practitionerController.getOneById(mockPractitionerId);
      expect(result).toEqual(mockPractitioner);
    });

    it('should throw NotFoundException when practitioner is not found', async () => {
      const mockPractitionerId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(practitionerService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(practitionerService, 'getOne').mockResolvedValue(null);

      try {
        await practitionerController.getOneById(mockPractitionerId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Practitioner ${mockPractitionerId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create practitioner', () => {
    it('should create an practitioner', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockPractitioner = new Practitioner();
      jest
        .spyOn(practitionerService, 'savePractitioner')
        .mockResolvedValue(mockPractitioner);
      const payload = new SavePractitionerDto();
      const result = await practitionerController.createPractitioner(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(practitionerService.savePractitioner).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockPractitioner);
    });
  });

  describe('Update practitioner', () => {
    it('should update an practitioner', async () => {
      const objectId = new ObjectId();
      const mockPractitioner = new Practitioner();
      mockPractitioner.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(practitionerService, 'savePractitioner')
        .mockResolvedValue(mockPractitioner);
      const payload = new SavePractitionerDto({
        isNoLongerExperiencing: false,
      });
      const result = await practitionerController.updatePractitioner(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(practitionerService.savePractitioner).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete practitioner by Id', () => {
    it('should soft delete an practitioner', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(practitionerService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Practitioner()));
      practitionerService.softDeleteCard = jest.fn();
      await practitionerController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(practitionerService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.PRACTITIONERS,
      );
    });
  });
});
