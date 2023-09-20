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
import { IDCardService } from '../id-card.service';
import { IDCard } from '@modules/card/entity/child-entity/idCard.entity';
import {
  createIdCardPayload,
  idCardData,
  idCardPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './id-card.mock';
import { SyncIDCardDto } from '@modules/card/dto/id-card.dto';

describe('IDCardService', () => {
  let idCardService: IDCardService;
  let idCardRepository: Repository<IDCard>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([IDCard])],
      providers: [IDCardService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    idCardService = module.get<IDCardService>(IDCardService);
    idCardRepository = module.get<Repository<IDCard>>(
      getRepositoryToken(IDCard),
    );
    await dataSource.getMongoRepository(IDCard).insertMany(idCardData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await idCardRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(IDCardService).toBeDefined();
  });

  describe('saveIDCard', () => {
    it('should create and save a new ID Card when id is not provided', async () => {
      const countBefore = await idCardRepository.count();
      const result = await idCardService.saveIDCard(
        mockProfile,
        createIdCardPayload,
      );
      const countAfter = await idCardRepository.count();
      expect(result._id).toEqual(createIdCardPayload._id);
      expect(result.isFollowedUp).toBe(createIdCardPayload.isFollowedUp);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but IDCard already exist', async () => {
      try {
        await idCardService.saveIDCard(mockProfile, idCardPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`IDCard ${idCardPayload._id} already exist`);
      }
    });

    it('should find and save an existing ID Card when id is provided', async () => {
      const idCardId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await idCardService.saveIDCard(
        mockProfile,
        idCardPayload,
        idCardId,
      );
      expect(result._id).toEqual(idCardId);
      expect(result.isFollowedUp).toEqual(idCardPayload.isFollowedUp);
    });

    it('should throw BadRequestException when id is provided but ID Card does not exist', async () => {
      const mockIdCardId = new ObjectId();
      try {
        await idCardService.saveIDCard(
          mockProfile,
          idCardPayload,
          mockIdCardId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(`IDCard ${mockIdCardId} does not exist`);
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of IDCards', async () => {
      const IDCards = await idCardRepository.find();
      const count = await idCardRepository.count();

      const result = await idCardService.getAll(mockProfile, mockPageRequest);
      expect(result).toBeInstanceOf(Pageable);
      expect(result.itemCount).toBe(count);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getAllSync', () => {
    it('should return a Pageable of ID Card', async () => {
      const IdCards = await idCardRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.ID_CARD,
        },
      });
      const filteredIdCards = IdCards.filter(
        (IdCard) =>
          IdCard.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await idCardService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncIDCards = filteredIdCards.map(
        (IdCard) => new SyncIDCardDto(IdCard),
      );
      expect(result.result).toEqual(syncIDCards);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an ID Card if it exists', async () => {
      const mockIdCardId = new ObjectId('650156e338b8a56d37856604');

      const idCard = await idCardRepository.findOne({
        where: {
          _id: mockIdCardId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.ID_CARD,
        },
      });

      const result = await idCardService.getOne(mockProfile, mockIdCardId);

      expect(result).toEqual(idCard);
    });

    it('should throw NotFoundException if ID Card does not exist', async () => {
      const mockIdCardId = new ObjectId();
      try {
        await idCardService.getOne(mockProfile, mockIdCardId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`IDCard ${mockIdCardId} does not exist`);
      }
    });
  });
});
