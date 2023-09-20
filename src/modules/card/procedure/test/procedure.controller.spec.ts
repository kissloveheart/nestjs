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
import { ProcedureController } from '../procedure.controller';
import { ProcedureService } from '../procedure.service';
import { Procedure } from '@modules/card/entity/child-entity/procedure.entity';
import {
  mockProfile,
  mockPageRequest,
  mockPageRequestSync,
} from './procedure.mock';
import {
  SaveProcedureDto,
  SyncProcedureDto,
} from '@modules/card/dto/procedure.dto';

describe('ProcedureController', () => {
  let procedureController: ProcedureController;
  let procedureService: ProcedureService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Procedure])],
      controllers: [ProcedureController],
      providers: [ProcedureService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    procedureController = module.get<ProcedureController>(ProcedureController);
    procedureService = module.get<ProcedureService>(ProcedureService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(procedureService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of procedures', async () => {
      const mockProcedures = [new Procedure(), new Procedure()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      procedureService.getAll = jest.fn().mockReturnValue(mockProcedures);

      const result = await procedureController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(procedureService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockProcedures);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced procedures', async () => {
      const mockSyncedProcedures: SyncProcedureDto[] = [
        new SyncProcedureDto(new Procedure()),
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

      jest.spyOn(procedureService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedProcedures, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedProcedures.length,
        }),
      );

      const result = await procedureController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an procedure by ID', async () => {
      const mockProcedureId = new ObjectId();
      const mockProcedure = new Procedure();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(procedureService, 'getOne').mockResolvedValue(mockProcedure);
      const result = await procedureController.getOneById(mockProcedureId);
      expect(result).toEqual(mockProcedure);
    });

    it('should throw NotFoundException when procedure is not found', async () => {
      const mockProcedureId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(procedureService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(procedureService, 'getOne').mockResolvedValue(null);

      try {
        await procedureController.getOneById(mockProcedureId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `procedure ${mockProcedureId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create procedure', () => {
    it('should create an procedure', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockProcedure = new Procedure();
      jest
        .spyOn(procedureService, 'saveProcedure')
        .mockResolvedValue(mockProcedure);
      const payload = new SaveProcedureDto();
      const result = await procedureController.createProcedure(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(procedureService.saveProcedure).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockProcedure);
    });
  });

  describe('Update procedure', () => {
    it('should update an procedure', async () => {
      const objectId = new ObjectId();
      const mockProcedure = new Procedure();
      mockProcedure.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(procedureService, 'saveProcedure')
        .mockResolvedValue(mockProcedure);
      const payload = new SaveProcedureDto({
        isNoLongerExperiencing: false,
      });
      const result = await procedureController.updateProcedure(
        objectId,
        payload,
      );
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(procedureService.saveProcedure).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete procedure by Id', () => {
    it('should soft delete an procedure', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(procedureService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Procedure()));
      procedureService.softDeleteCard = jest.fn();
      await procedureController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(procedureService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.PROCEDURES,
      );
    });
  });
});
