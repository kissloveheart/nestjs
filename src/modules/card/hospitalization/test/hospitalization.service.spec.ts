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
import { HospitalizationService } from '../hospitalization.service';
import { Hospitalization } from '@modules/card/entity/child-entity/hospitalization.entity';
import {
  createHospitalizationPayload,
  hospitalizationData,
  hospitalizationPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './hospitalization.mock';
import { SyncHospitalizationDto } from '@modules/card/dto/hospitalization.dto';

describe('HospitalizationService', () => {
  let hospitalizationService: HospitalizationService;
  let hospitalizationRepository: Repository<Hospitalization>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Hospitalization]),
      ],
      providers: [HospitalizationService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    hospitalizationService = module.get<HospitalizationService>(
      HospitalizationService,
    );
    hospitalizationRepository = module.get<Repository<Hospitalization>>(
      getRepositoryToken(Hospitalization),
    );
    await dataSource
      .getMongoRepository(Hospitalization)
      .insertMany(hospitalizationData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await hospitalizationRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(hospitalizationService).toBeDefined();
  });

  describe('saveHospitalization', () => {
    it('should create and save a new hospitalization when id is not provided', async () => {
      const countBefore = await hospitalizationRepository.count();
      const result = await hospitalizationService.saveHospitalization(
        mockProfile,
        createHospitalizationPayload,
      );
      const countAfter = await hospitalizationRepository.count();
      expect(result._id).toEqual(createHospitalizationPayload._id);
      expect(result.isFollowedUp).toBe(
        createHospitalizationPayload.isFollowedUp,
      );
      expect(result.location).toBe(createHospitalizationPayload.location);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but hospitalization already exist', async () => {
      try {
        await hospitalizationService.saveHospitalization(
          mockProfile,
          hospitalizationPayload,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Hospitalization ${hospitalizationPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing hospitalization when id is provided', async () => {
      const hospitalizationId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await hospitalizationService.saveHospitalization(
        mockProfile,
        hospitalizationPayload,
        hospitalizationId,
      );
      expect(result._id).toEqual(hospitalizationId);
      expect(result.isFollowedUp).toEqual(hospitalizationPayload.isFollowedUp);
      expect(result.location).toEqual(hospitalizationPayload.location);
    });

    it('should throw BadRequestException when id is provided but hospitalization does not exist', async () => {
      const mockHospitalizationId = new ObjectId();
      try {
        await hospitalizationService.saveHospitalization(
          mockProfile,
          hospitalizationPayload,
          mockHospitalizationId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Hospitalization ${mockHospitalizationId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of hospitalizations', async () => {
      const hospitalizations = await hospitalizationRepository.find();
      const count = await hospitalizationRepository.count();

      const result = await hospitalizationService.getAll(
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
    it('should return a Pageable of hospitalizations', async () => {
      const hospitalizations = await hospitalizationRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.HOSPITALIZATIONS,
        },
      });
      const filteredHospitalizations = hospitalizations.filter(
        (hospitalization) =>
          hospitalization.updatedTime >
          new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await hospitalizationService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncHospitalizations = filteredHospitalizations.map(
        (hospitalization) => new SyncHospitalizationDto(hospitalization),
      );
      expect(result.result).toEqual(syncHospitalizations);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an hospitalization if it exists', async () => {
      const mockHospitalizationId = new ObjectId('650156e338b8a56d37856604');

      const hospitalization = await hospitalizationRepository.findOne({
        where: {
          _id: mockHospitalizationId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.HOSPITALIZATIONS,
        },
      });

      const result = await hospitalizationService.getOne(
        mockProfile,
        mockHospitalizationId,
      );

      expect(result).toEqual(hospitalization);
    });

    it('should throw NotFoundException if hospitalization does not exist', async () => {
      const mockHospitalizationId = new ObjectId();
      try {
        await hospitalizationService.getOne(mockProfile, mockHospitalizationId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Hospitalization ${mockHospitalizationId} does not exist`,
        );
      }
    });
  });
});
