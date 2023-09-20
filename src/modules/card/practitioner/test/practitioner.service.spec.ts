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
import { PractitionerService } from '../practitioner.service';
import { Practitioner } from '@modules/card/entity/child-entity/practitioner.entity';
import {
  createPractitionerPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  practitionerData,
  practitionerPayload,
} from './practitioner.mock';
import { SyncPractitionerDto } from '@modules/card/dto/practitioner.dto';

describe('PractitionerService', () => {
  let practitionerService: PractitionerService;
  let practitionerRepository: Repository<Practitioner>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(),
        TypeOrmModule.forFeature([Practitioner]),
      ],
      providers: [PractitionerService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    practitionerService = module.get<PractitionerService>(PractitionerService);
    practitionerRepository = module.get<Repository<Practitioner>>(
      getRepositoryToken(Practitioner),
    );
    await dataSource
      .getMongoRepository(Practitioner)
      .insertMany(practitionerData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await practitionerRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(practitionerService).toBeDefined();
  });

  describe('savePractitioner', () => {
    it('should create and save a new practitioner when id is not provided', async () => {
      const countBefore = await practitionerRepository.count();
      const result = await practitionerService.savePractitioner(
        mockProfile,
        createPractitionerPayload,
      );
      const countAfter = await practitionerRepository.count();
      expect(result._id).toEqual(createPractitionerPayload._id);
      expect(result.isFollowedUp).toBe(createPractitionerPayload.isFollowedUp);
      expect(result.phone).toBe(createPractitionerPayload.phone);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but practitioner already exist', async () => {
      try {
        await practitionerService.savePractitioner(
          mockProfile,
          practitionerPayload,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Practitioner ${practitionerPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing practitioner when id is provided', async () => {
      const practitionerId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await practitionerService.savePractitioner(
        mockProfile,
        practitionerPayload,
        practitionerId,
      );
      expect(result._id).toEqual(practitionerId);
      expect(result.isFollowedUp).toEqual(practitionerPayload.isFollowedUp);
      expect(result.phone).toEqual(practitionerPayload.phone);
      expect(result.title).toEqual(practitionerPayload.title);
    });

    it('should throw BadRequestException when id is provided but practitioner does not exist', async () => {
      const mockPractitionerId = new ObjectId();
      try {
        await practitionerService.savePractitioner(
          mockProfile,
          practitionerPayload,
          mockPractitionerId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(
          `Practitioner ${mockPractitionerId} does not exist`,
        );
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of practitioners', async () => {
      const practitioners = await practitionerRepository.find();
      const count = await practitionerRepository.count();

      const result = await practitionerService.getAll(
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
    it('should return a Pageable of practitioners', async () => {
      const practitioners = await practitionerRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.PRACTITIONERS,
        },
      });
      const filteredPractitioners = practitioners.filter(
        (practitioner) =>
          practitioner.updatedTime >
          new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await practitionerService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncPractitioners = filteredPractitioners.map(
        (practitioner) => new SyncPractitionerDto(practitioner),
      );
      expect(result.result).toEqual(syncPractitioners);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an practitioner if it exists', async () => {
      const mockPractitionerId = new ObjectId('650156e338b8a56d37856604');

      const practitioner = await practitionerRepository.findOne({
        where: {
          _id: mockPractitionerId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.PRACTITIONERS,
        },
      });

      const result = await practitionerService.getOne(
        mockProfile,
        mockPractitionerId,
      );

      expect(result).toEqual(practitioner);
    });

    it('should throw NotFoundException if practitioner does not exist', async () => {
      const mockPractitionerId = new ObjectId();
      try {
        await practitionerService.getOne(mockProfile, mockPractitionerId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Practitioner ${mockPractitionerId} does not exist`,
        );
      }
    });
  });
});
