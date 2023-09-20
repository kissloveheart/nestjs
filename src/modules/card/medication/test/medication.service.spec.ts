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
import { Medication } from '@modules/card/entity/child-entity/medication.entity';
import { MedicationService } from '../medication.service';
import {
  createMedicationPayload,
  medicationData,
  medicationPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './medication.mock';
import { SyncMedicationDto } from '@modules/card/dto/medication.dto';

describe('medicationService', () => {
  let medicationService: MedicationService;
  let medicationRepository: Repository<Medication>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Medication]),
      ],
      providers: [MedicationService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    medicationService = module.get<MedicationService>(MedicationService);
    medicationRepository = module.get<Repository<Medication>>(
      getRepositoryToken(Medication),
    );
    await dataSource.getMongoRepository(Medication).insertMany(medicationData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await medicationRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(medicationService).toBeDefined();
  });

  describe('saveMedication', () => {
    it('should create and save a new medication when id is not provided', async () => {
      const countBefore = await medicationRepository.count();
      const result = await medicationService.saveMedication(
        mockProfile,
        createMedicationPayload,
      );
      const countAfter = await medicationRepository.count();
      expect(result._id).toEqual(createMedicationPayload._id);
      expect(result.isFollowedUp).toBe(createMedicationPayload.isFollowedUp);
      expect(result.instruction).toBe(createMedicationPayload.instruction);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but medication already exist', async () => {
      try {
        await medicationService.saveMedication(mockProfile, medicationPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Medication ${medicationPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing Medication when id is provided', async () => {
      const medicationId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await medicationService.saveMedication(
        mockProfile,
        medicationPayload,
        medicationId,
      );
      expect(result._id).toEqual(medicationId);
      expect(result.isFollowedUp).toEqual(medicationPayload.isFollowedUp);
      expect(result.instruction).toEqual(medicationPayload.instruction);
    });

    it('should throw BadRequestException when id is provided but medication does not exist', async () => {
      const mockMedicationId = new ObjectId();
      try {
        await medicationService.saveMedication(
          mockProfile,
          medicationPayload,
          mockMedicationId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Medication ${mockMedicationId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of medications', async () => {
      const medications = await medicationRepository.find();
      const count = await medicationRepository.count();

      const result = await medicationService.getAll(
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
    it('should return a Pageable of medication', async () => {
      const medications = await medicationRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.MEDICATIONS,
        },
      });
      const filteredMedications = medications.filter(
        (medication) =>
          medication.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await medicationService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncMedications = filteredMedications.map(
        (medication) => new SyncMedicationDto(medication),
      );
      expect(result.result).toEqual(syncMedications);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an medication if it exists', async () => {
      const mockMedicationId = new ObjectId('650156e338b8a56d37856604');

      const medication = await medicationRepository.findOne({
        where: {
          _id: mockMedicationId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.MEDICATIONS,
        },
      });

      const result = await medicationService.getOne(
        mockProfile,
        mockMedicationId,
      );

      expect(result).toEqual(medication);
    });

    it('should throw NotFoundException if medication does not exist', async () => {
      const mockMedicationId = new ObjectId();
      try {
        await medicationService.getOne(mockProfile, mockMedicationId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Medication ${mockMedicationId} does not exist`,
        );
      }
    });
  });
});
