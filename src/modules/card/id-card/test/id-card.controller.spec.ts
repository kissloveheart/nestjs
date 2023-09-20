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
import { IDCardController } from '../id-card.controller';
import { IDCardService } from '../id-card.service';
import { IDCard } from '@modules/card/entity/child-entity/idCard.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './id-card.mock';
import { SaveIDCardDto, SyncIDCardDto } from '@modules/card/dto/id-card.dto';

describe('IDCardController', () => {
  let idCardController: IDCardController;
  let idCardService: IDCardService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([IDCard])],
      controllers: [IDCardController],
      providers: [IDCardService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    idCardController = module.get<IDCardController>(IDCardController);
    idCardService = module.get<IDCardService>(IDCardService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(idCardService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of ID Card', async () => {
      const mockIdCard = [new IDCard(), new IDCard()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      idCardService.getAll = jest.fn().mockReturnValue(mockIdCard);

      const result = await idCardController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(idCardService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockIdCard);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced ID Card', async () => {
      const mockSyncIDCard: SyncIDCardDto[] = [new SyncIDCardDto(new IDCard())];
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

      jest.spyOn(idCardService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncIDCard, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncIDCard.length,
        }),
      );

      const result = await idCardController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an ID Card by ID', async () => {
      const mockIdCardId = new ObjectId();
      const mockIdCard = new IDCard();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(idCardService, 'getOne').mockResolvedValue(mockIdCard);
      const result = await idCardController.getOneById(mockIdCardId);
      expect(result).toEqual(mockIdCard);
    });

    it('should throw NotFoundException when ID Card is not found', async () => {
      const mockIdCardId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(idCardService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(idCardService, 'getOne').mockResolvedValue(null);

      try {
        await idCardController.getOneById(mockIdCardId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `IDCard ${mockIdCardId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create ID Card', () => {
    it('should create an ID Card', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockIdCard = new IDCard();
      jest.spyOn(idCardService, 'saveIDCard').mockResolvedValue(mockIdCard);
      const payload = new SaveIDCardDto();
      const result = await idCardController.createIDCard(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(idCardService.saveIDCard).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockIdCard);
    });
  });

  describe('Update IDCard', () => {
    it('should update an ID Card', async () => {
      const objectId = new ObjectId();
      const mockIdCard = new IDCard();
      mockIdCard.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(idCardService, 'saveIDCard').mockResolvedValue(mockIdCard);
      const payload = new SaveIDCardDto({
        isNoLongerExperiencing: false,
      });
      const result = await idCardController.updateIDCard(objectId, payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(idCardService.saveIDCard).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete ID Card by Id', () => {
    it('should soft delete an ID Card', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(idCardService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new IDCard()));
      idCardService.softDeleteCard = jest.fn();
      await idCardController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(idCardService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.ID_CARD,
      );
    });
  });
});
