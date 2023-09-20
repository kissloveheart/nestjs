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
import { Vaccination } from '@modules/card/entity/child-entity/vaccination.entity';
import { VaccinationService } from '../vaccination.service';
import {
  createVaccinationPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  vaccinationData,
  vaccinationPayload,
} from './vaccination.mock';
import { SyncVaccinationDto } from '@modules/card/dto/vaccination.dto';

describe('VaccinationService', () => {
  let vaccinationService: VaccinationService;
  let vaccinationRepository: Repository<Vaccination>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Vaccination]),
      ],
      providers: [VaccinationService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    vaccinationService = module.get<VaccinationService>(VaccinationService);
    vaccinationRepository = module.get<Repository<Vaccination>>(
      getRepositoryToken(Vaccination),
    );
    await dataSource
      .getMongoRepository(Vaccination)
      .insertMany(vaccinationData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await vaccinationRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(vaccinationService).toBeDefined();
  });

  describe('saveVaccination', () => {
    it('should create and save a new vaccination when id is not provided', async () => {
      const countBefore = await vaccinationRepository.count();
      const result = await vaccinationService.saveVaccination(
        mockProfile,
        createVaccinationPayload,
      );
      const countAfter = await vaccinationRepository.count();
      expect(result._id).toEqual(createVaccinationPayload._id);
      expect(result.isFollowedUp).toBe(createVaccinationPayload.isFollowedUp);
      expect(result.description).toBe(createVaccinationPayload.description);
      expect(result.location).toBe(createVaccinationPayload.location);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but vaccination already exist', async () => {
      try {
        await vaccinationService.saveVaccination(
          mockProfile,
          vaccinationPayload,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Vaccination ${vaccinationPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing vaccination when id is provided', async () => {
      const vaccinationId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await vaccinationService.saveVaccination(
        mockProfile,
        vaccinationPayload,
        vaccinationId,
      );
      expect(result._id).toEqual(vaccinationId);
      expect(result.isFollowedUp).toEqual(vaccinationPayload.isFollowedUp);
    });

    it('should throw BadRequestException when id is provided but vaccination does not exist', async () => {
      const mockVaccinationId = new ObjectId();
      try {
        await vaccinationService.saveVaccination(
          mockProfile,
          vaccinationPayload,
          mockVaccinationId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Vaccination ${mockVaccinationId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of vaccinations', async () => {
      const vaccinations = await vaccinationRepository.find();
      const count = await vaccinationRepository.count();

      const result = await vaccinationService.getAll(
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
    it('should return a Pageable of vaccinations', async () => {
      const vaccinations = await vaccinationRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.VACCINATIONS,
        },
      });
      const filteredVaccinations = vaccinations.filter(
        (vaccination) =>
          vaccination.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await vaccinationService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncVaccinations = filteredVaccinations.map(
        (vaccination) => new SyncVaccinationDto(vaccination),
      );
      expect(result.result).toEqual(syncVaccinations);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an vaccination if it exists', async () => {
      const mockVaccinationId = new ObjectId('650156e338b8a56d37856604');

      const vaccination = await vaccinationRepository.findOne({
        where: {
          _id: mockVaccinationId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.VACCINATIONS,
        },
      });

      const result = await vaccinationService.getOne(
        mockProfile,
        mockVaccinationId,
      );

      expect(result).toEqual(vaccination);
    });

    it('should throw NotFoundException if vaccination does not exist', async () => {
      const mockVaccinationId = new ObjectId();
      try {
        await vaccinationService.getOne(mockProfile, mockVaccinationId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Vaccination ${mockVaccinationId} does not exist`,
        );
      }
    });
  });
});
