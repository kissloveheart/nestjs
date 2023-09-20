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
import { TopicController } from '../topic.controller';
import { TopicService } from '../topic.service';
import { Topic } from '../entity/topic.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './topic.mock';
import {
  SyncTopicDto,
  TopicCreateDto,
  TopicDtoUpdateDto,
} from '../dto/topic.dto';
import { faker } from '@faker-js/faker';

describe('TopicController', () => {
  let topicController: TopicController;
  let topicService: TopicService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Topic])],
      controllers: [TopicController],
      providers: [TopicService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    topicController = module.get<TopicController>(TopicController);
    topicService = module.get<TopicService>(TopicService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(topicService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of topics', async () => {
      const mockTopics = [new Topic(), new Topic()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      topicService.getAll = jest.fn().mockReturnValue(mockTopics);

      const result = await topicController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(topicService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockTopics);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced topics', async () => {
      const mockSyncedTopics: SyncTopicDto[] = [new SyncTopicDto(new Topic())];
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
          },
        ],
        size: 10,
      };
      clsService.get = jest.fn().mockReturnValue(mockProfile);

      jest.spyOn(topicService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedTopics, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedTopics.length,
        }),
      );

      const result = await topicController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an topic by ID', async () => {
      const mockTopicId = new ObjectId();
      const mockTopic = new Topic();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(topicService, 'getOne').mockResolvedValue(mockTopic);
      const result = await topicController.getOneById(mockTopicId);
      expect(result).toEqual(mockTopic);
    });

    it('should throw NotFoundException when topic is not found', async () => {
      const mockTopicId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(topicService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(topicService, 'getOne').mockResolvedValue(null);

      try {
        await topicController.getOneById(mockTopicId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Topic ${mockTopicId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create topic', () => {
    it('should create an topic', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockTopic = new Topic();
      jest.spyOn(topicService, 'saveTopic').mockResolvedValue(mockTopic);
      const payload = new TopicCreateDto();
      const result = await topicController.createTopic(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(topicService.saveTopic).toHaveBeenCalledWith(mockProfile, payload);
      expect(result).toEqual(mockTopic);
    });
  });

  describe('Update topic', () => {
    it('should update an topic', async () => {
      const objectId = new ObjectId();
      const title = faker.animal.bird();
      const mockTopic = new Topic();
      mockTopic.title = title;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(topicService, 'saveTopic').mockResolvedValue(mockTopic);
      const payload = new TopicDtoUpdateDto();
      payload.title = title;
      const result = await topicController.updateTopic(objectId, payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(topicService.saveTopic).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result.title).toEqual(payload.title);
    });
  });

  describe('Delete topic by Id', () => {
    it('should soft delete an topic', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(topicService, 'findOne')
        .mockReturnValue(Promise.resolve(new Topic()));
      topicService.softDelete = jest.fn();
      await topicController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(topicService.softDelete).toHaveBeenCalledWith(objectId);
    });
  });
});
