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
import { QuestionService } from '../question.service';
import { Question } from '@modules/card/entity/child-entity/question.entity';
import {
  createQuestionPayload,
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
  questionData,
  questionPayload,
} from './question.mock';
import { SyncQuestionDto } from '@modules/card/dto/question.dto';

describe('QuestionService', () => {
  let questionService: QuestionService;
  let questionRepository: Repository<Question>;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Question])],
      providers: [QuestionService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    questionService = module.get<QuestionService>(QuestionService);
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    await dataSource.getMongoRepository(Question).insertMany(questionData);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await questionRepository.clear();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(questionService).toBeDefined();
  });

  describe('saveQuestion', () => {
    it('should create and save a new question when id is not provided', async () => {
      const countBefore = await questionRepository.count();
      const result = await questionService.saveQuestion(
        mockProfile,
        createQuestionPayload,
      );
      const countAfter = await questionRepository.count();
      expect(result._id).toEqual(createQuestionPayload._id);
      expect(result.isFollowedUp).toBe(createQuestionPayload.isFollowedUp);
      expect(countAfter).toBe(countBefore + 1);
    });

    it('should throw ConflictException when id is not provided but question already exist', async () => {
      try {
        await questionService.saveQuestion(mockProfile, questionPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe(
          `Question ${questionPayload._id} already exist`,
        );
      }
    });

    it('should find and save an existing question when id is provided', async () => {
      const questionId = new ObjectId('6500113c1895a06e02ab3d87');

      const result = await questionService.saveQuestion(
        mockProfile,
        questionPayload,
        questionId,
      );
      expect(result._id).toEqual(questionId);
      expect(result.isFollowedUp).toEqual(questionPayload.isFollowedUp);
    });

    it('should throw BadRequestException when id is provided but question does not exist', async () => {
      const mockQuestionId = new ObjectId();
      try {
        await questionService.saveQuestion(
          mockProfile,
          questionPayload,
          mockQuestionId,
        );
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe(`Question ${mockQuestionId} does not exist`);
      }
    });
  });

  describe('getAll', () => {
    it('should return a Pageable of questions', async () => {
      const questions = await questionRepository.find();
      const count = await questionRepository.count();

      const result = await questionService.getAll(mockProfile, mockPageRequest);
      expect(result).toBeInstanceOf(Pageable);
      expect(result.itemCount).toBe(count);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getAllSync', () => {
    it('should return a Pageable of questions', async () => {
      const questions = await questionRepository.find({
        where: {
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.QUESTIONS,
        },
      });
      const filteredQuestions = questions.filter(
        (question) =>
          question.updatedTime > new Date(new Date().getTime() - 10 * 60000),
      );

      const result = await questionService.getAllSync(
        mockProfile,
        mockPageRequestSync,
      );

      expect(result).toBeInstanceOf(Pageable);
      const syncQuestions = filteredQuestions.map(
        (question) => new SyncQuestionDto(question),
      );
      expect(result.result).toEqual(syncQuestions);
      expect(result.page).toBe(1);
      expect(result.size).toBe(10);
    });
  });

  describe('getOne', () => {
    it('should return an question if it exists', async () => {
      const mockQuestionId = new ObjectId('650156e338b8a56d37856604');

      const question = await questionRepository.findOne({
        where: {
          _id: mockQuestionId,
          deletedTime: null,
          profile: new ObjectId('650156e338b8a56d37856611'),
          cardType: CardType.QUESTIONS,
        },
      });

      const result = await questionService.getOne(mockProfile, mockQuestionId);

      expect(result).toEqual(question);
    });

    it('should throw NotFoundException if question does not exist', async () => {
      const mockQuestionId = new ObjectId();
      try {
        await questionService.getOne(mockProfile, mockQuestionId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(`Question ${mockQuestionId} does not exist`);
      }
    });
  });
});
