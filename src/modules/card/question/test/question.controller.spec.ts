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
import { QuestionController } from '../question.controller';
import { QuestionService } from '../question.service';
import { Question } from '@modules/card/entity/child-entity/question.entity';
import {
  mockPageRequest,
  mockPageRequestSync,
  mockProfile,
} from './question.mock';
import {
  SaveQuestionDto,
  SyncQuestionDto,
} from '@modules/card/dto/question.dto';

describe('QuestionController', () => {
  let questionController: QuestionController;
  let questionService: QuestionService;
  let clsService: ClsService;
  beforeEach(async () => {
    const dataSource: DataSource = await initialTypeOrm();
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([Question])],
      controllers: [QuestionController],
      providers: [QuestionService, ClsService],
    })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .useMocker(createMock)
      .compile();

    questionController = module.get<QuestionController>(QuestionController);
    questionService = module.get<QuestionService>(QuestionService);
    clsService = module.get<ClsService>(ClsService);
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(questionService).toBeDefined();
  });

  describe('getAll', () => {
    it('should return a list of questions', async () => {
      const mockQuestions = [new Question(), new Question()];

      clsService.get = jest.fn().mockReturnValue(mockProfile);
      questionService.getAll = jest.fn().mockReturnValue(mockQuestions);

      const result = await questionController.getAll(mockPageRequest);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(questionService.getAll).toHaveBeenCalledWith(
        mockProfile,
        mockPageRequest,
      );
      expect(result).toEqual(mockQuestions);
    });
  });

  describe('getAllSync', () => {
    it('should return a list of synced questions', async () => {
      const mockSyncedQuestions: SyncQuestionDto[] = [
        new SyncQuestionDto(new Question()),
      ];
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

      jest.spyOn(questionService, 'getAllSync').mockResolvedValue(
        new Pageable(mockSyncedQuestions, {
          size: mockPageRequest.size,
          page: mockPageRequest.page,
          count: mockSyncedQuestions.length,
        }),
      );

      const result = await questionController.getAllSync(mockPageRequestSync);

      expect(result).toEqual(mockExpectedPageable);
    });
  });

  describe('getOneById', () => {
    it('should return an question by ID', async () => {
      const mockQuestionId = new ObjectId();
      const mockQuestion = new Question();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest.spyOn(questionService, 'getOne').mockResolvedValue(mockQuestion);
      const result = await questionController.getOneById(mockQuestionId);
      expect(result).toEqual(mockQuestion);
    });

    it('should throw NotFoundException when question is not found', async () => {
      const mockQuestionId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(questionService, 'findOneCardWithDeletedTimeNull')
        .mockResolvedValue(null);
      jest.spyOn(questionService, 'getOne').mockResolvedValue(null);

      try {
        await questionController.getOneById(mockQuestionId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe(
          `Question ${mockQuestionId.toString()} does not exist`,
        );
      }
    });
  });

  describe('Create question', () => {
    it('should create an question', async () => {
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      const mockQuestion = new Question();
      jest
        .spyOn(questionService, 'saveQuestion')
        .mockResolvedValue(mockQuestion);
      const payload = new SaveQuestionDto();
      const result = await questionController.createQuestion(payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(questionService.saveQuestion).toHaveBeenCalledWith(
        mockProfile,
        payload,
      );
      expect(result).toEqual(mockQuestion);
    });
  });

  describe('Update question', () => {
    it('should update an question', async () => {
      const objectId = new ObjectId();
      const mockQuestion = new Question();
      mockQuestion.isFollowedUp = false;
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(questionService, 'saveQuestion')
        .mockResolvedValue(mockQuestion);
      const payload = new SaveQuestionDto({
        isNoLongerExperiencing: false,
      });
      const result = await questionController.updateQuestion(objectId, payload);
      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);
      expect(questionService.saveQuestion).toHaveBeenCalledWith(
        mockProfile,
        payload,
        objectId,
      );

      expect(result).toEqual(payload);
    });
  });

  describe('Delete question by Id', () => {
    it('should soft delete an question', async () => {
      const objectId = new ObjectId();
      clsService.get = jest.fn().mockReturnValue(mockProfile);
      jest
        .spyOn(questionService, 'findOneCardWithDeletedTimeNull')
        .mockReturnValue(Promise.resolve(new Question()));
      questionService.softDeleteCard = jest.fn();
      await questionController.softDelete(objectId);

      expect(clsService.get).toHaveBeenCalledWith(PROFILE_TOKEN);

      expect(questionService.softDeleteCard).toHaveBeenCalledWith(
        mockProfile._id,
        objectId,
        CardType.QUESTIONS,
      );
    });
  });
});
