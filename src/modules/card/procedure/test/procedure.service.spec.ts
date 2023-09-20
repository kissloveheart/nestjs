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
import { ProcedureService } from '../procedure.service';
import { Procedure } from '@modules/card/entity/child-entity/procedure.entity';
import {
  createProcedurePayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  procedureData,
  procedurePayload,
} from './procedure.mock';
import { SyncProcedureDto } from '@modules/card/dto/procedure.dto';

describe('ProcedureService', () => {
  let procedureService: ProcedureService;
  let procedureRepository: Repository<Procedure>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Procedure])],
      providers: [ProcedureService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    procedureService = module.get<ProcedureService>(ProcedureService);
    procedureRepository = module.get<Repository<Procedure>>(
      getRepositoryToken(Procedure),
    );
    await dataSource.getMongoRepository(Procedure).insertMany(procedureData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await procedureRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(procedureService).toBeDefined();
  });

  describe('saveProcedure', () => {
    it('should create and save a new procedure when id is not provided', async () => {
      const countBefore = await procedureRepository.count();
      const result = await procedureService.saveProcedure(
        mockProfile,
        createProcedurePayload,
      );
      const countAfter = await procedureRepository.count();
      expect(result._id).toEqual(createProcedurePayload._id);
      expect(result.isFollowedUp).toBe(createProcedurePayload.isFollowedUp);
      expect(result.location).toBe(createProcedurePayload.location);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but procedure already exist', async () => {
      try {
        await procedureService.saveProcedure(mockProfile, procedurePayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Procedure ${procedurePayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing procedure when id is provided', async () => {
      const procedureId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await procedureService.saveProcedure(
        mockProfile,
        procedurePayload,
        procedureId,
      );
      expect(result._id).toEqual(procedureId);
      expect(result.isFollowedUp).toEqual(procedurePayload.isFollowedUp);
      expect(result.location).toEqual(procedurePayload.location);
    });

    it('should throw BadRequestException when id is provided but procedure does not exist', async () => {
      const mockProcedureId = new ObjectId();
      try {
        await procedureService.saveProcedure(
          mockProfile,
          procedurePayload,
          mockProcedureId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Procedure ${mockProcedureId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of procedures', async () => {
      const procedures = await procedureRepository.find();
      const count = await procedureRepository.count();

      const result = await procedureService.getAll(
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
    it('should return a Pageable of procedures', async () => {
      const procedures = await procedureRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.PROCEDURES,
        },
      });
      const filteredProcedures = procedures.filter(
        (procedure) =>
          procedure.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await procedureService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncProcedures = filteredProcedures.map(
        (procedure) => new SyncProcedureDto(procedure),
      );
      expect(result.result).toEqual(syncProcedures);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an procedure if it exists', async () => {
      const mockProcedureId = new ObjectId('650156e338b8a56d37856604');

      const procedure = await procedureRepository.findOne({
        where: {
          _id: mockProcedureId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.PROCEDURES,
        },
      });

      const result = await procedureService.getOne(
        mockProfile,
        mockProcedureId,
      );

      expect(result).toEqual(procedure);
    });

    it('should throw NotFoundException if procedure does not exist', async () => {
      const mockProcedureId = new ObjectId();
      try {
        await procedureService.getOne(mockProfile, mockProcedureId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Procedure ${mockProcedureId} does not exist`,
        );
      }
    });
  });
});
