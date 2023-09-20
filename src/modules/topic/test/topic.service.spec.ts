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
import { closeMongoConnection, initialTypeOrm } from '@test';
import { TopicService } from '../topic.service';
import { Topic } from '../entity/topic.entity';
import {
  createTopicPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  topicData,
  topicPayload,
} from './topic.mock';
import { SyncTopicDto } from '../dto/topic.dto';

describe('TopicService', () => {
  let topicService: TopicService;
  let topicRepository: Repository<Topic>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Topic])],
      providers: [TopicService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    topicService = module.get<TopicService>(TopicService);
    topicRepository = module.get<Repository<Topic>>(getRepositoryToken(Topic));
    await dataSource.getMongoRepository(Topic).insertMany(topicData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await topicRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  describe('saveTopic', () => {
    it('should create and save a new topic when id is not provided', async () => {
      const countBefore = await topicRepository.count();
      const result = await topicService.saveTopic(
        mockProfile,
        createTopicPayload,
      );
      const countAfter = await topicRepository.count();
      expect(result._id).toEqual(createTopicPayload._id);
      expect(result.title).toBe(createTopicPayload.title);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but topic already exist', async () => {
      try {
        await topicService.saveTopic(mockProfile, topicPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(`Topic ${topicPayload._id} already exist`);
      }
    });

    it('should find and save an existing topic when id is provided', async () => {
      const questionId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await topicService.saveTopic(
        mockProfile,
        topicPayload,
        questionId,
      );
      expect(result._id).toEqual(questionId);
      expect(result.title).toEqual(topicPayload.title);
    });

    it('should throw BadRequestException when id is provided but topic does not exist', async () => {
      const mockTopicId = new ObjectId();
      try {
        await topicService.saveTopic(mockProfile, topicPayload, mockTopicId);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(`Topic ${mockTopicId} does not exist`);
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of questions', async () => {
      const questions = await topicRepository.find();
      const count = await topicRepository.count();

      const result = await topicService.getAll(mockProfile, mockPageRequest);
      expect(result).toBeInstanceOf(Pageable);
      expect(result.itemCount).toBe(count);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getAllSync', () => {
    it('should return a Pageable of topics', async () => {
      const topics = await topicRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
        },
      });
      const filteredTopics = topics.filter(
        (topic) =>
          topic.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await topicService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncTopics = filteredTopics.map((topic) => new SyncTopicDto(topic));
      expect(result.result).toEqual(syncTopics);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an topic if it exists', async () => {
      const mockTopicId = new ObjectId('650156e338b8a56d37856604');

      const topic = await topicRepository.findOne({
        where: {
          _id: mockTopicId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
        },
      });

      const result = await topicService.getOne(mockProfile, mockTopicId);

      expect(result).toEqual(topic);
    });

    it('should throw NotFoundException if topic does not exist', async () => {
      const mockTopicId = new ObjectId();
      try {
        await topicService.getOne(mockProfile, mockTopicId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Topic ${mockTopicId} does not exist`);
      }
    });
  });
});
