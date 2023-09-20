import { DataSource, Repository } from 'typeorm';
import { AllergyService } from '../allergy.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Allergy } from '@modules/card/entity/child-entity/allergy.entity';
import { createMock } from '@golevelup/ts-jest';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  allergyPayload,
  allergyData,
  createAllergyPayload,
} from './allergy.mock';
import { Pageable } from '@types';
import { SyncAllergyDto } from '@modules/card/dto/allergy.dto';
import { ObjectId } from 'mongodb';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CardType } from '@enum';
import { closeMongoConnection, initialTypeOrm } from '@test';

describe('AllergyService', () => {
  let allergyService: AllergyService;
  let allergyRepository: Repository<Allergy>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Allergy])],
      providers: [AllergyService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    allergyService = module.get<AllergyService>(AllergyService);
    allergyRepository = module.get<Repository<Allergy>>(
      getRepositoryToken(Allergy),
    );
    await dataSource.getMongoRepository(Allergy).insertMany(allergyData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await allergyRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(allergyService).toBeDefined();
  });

  describe('saveAllergy', () => {
    it('should create and save a new allergy when id is not provided', async () => {
      const countBefore = await allergyRepository.count();

      const result = await allergyService.saveAllergy(
        mockProfile,
        createAllergyPayload,
      );
      const countAfter = await allergyRepository.count();
      expect(result._id).toEqual(createAllergyPayload._id);
      expect(result.isFollowedUp).toBe(createAllergyPayload.isFollowedUp);
      expect(result.type).toBe(createAllergyPayload.type);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but Allergy already exist', async () => {
      try {
        await allergyService.saveAllergy(mockProfile, allergyPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Allergy ${allergyPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing Allergy when id is provided', async () => {
      const allergyId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await allergyService.saveAllergy(
        mockProfile,
        allergyPayload,
        allergyId,
      );
      expect(result._id).toEqual(allergyId);
      expect(result.isFollowedUp).toEqual(allergyPayload.isFollowedUp);
      expect(result.type).toEqual(allergyPayload.type);
    });

    it('should throw BadRequestException when id is provided but Allergy does not exist', async () => {
      const mockAllergyId = new ObjectId();
      try {
        await allergyService.saveAllergy(
          mockProfile,
          allergyPayload,
          mockAllergyId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(`Allergy ${mockAllergyId} does not exist`);
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of allergies', async () => {
      const allergies = await allergyRepository.find();
      const count = await allergyRepository.count();

      const result = await allergyService.getAll(mockProfile, mockPageRequest);
      expect(result).toBeInstanceOf(Pageable);
      expect(result.itemCount).toBe(count);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getAllSync', () => {
    it('should return a Pageable of allergies', async () => {
      const allergies = await allergyRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.ALLERGIES,
        },
      });
      const filteredAllergies = allergies.filter(
        (allergy) =>
          allergy.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await allergyService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncAllergies = filteredAllergies.map(
        (allergy) => new SyncAllergyDto(allergy),
      );
      expect(result.result).toEqual(syncAllergies);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an allergy if it exists', async () => {
      const mockAllergyId = new ObjectId('650156e338b8a56d37856604');

      const allergy = await allergyRepository.findOne({
        where: {
          _id: mockAllergyId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.ALLERGIES,
        },
      });

      const result = await allergyService.getOne(mockProfile, mockAllergyId);

      expect(result).toEqual(allergy);
    });

    it('should throw NotFoundException if appointment does not exist', async () => {
      const mockAllergyId = new ObjectId();
      try {
        await allergyService.getOne(mockProfile, mockAllergyId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Allergy ${mockAllergyId} does not exist`);
      }
    });
  });
});
