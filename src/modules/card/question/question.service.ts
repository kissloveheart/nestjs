import { CardType } from '@enum';
import { LogService } from '@log';
import { Profile } from '@modules/profile';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { PageRequest, PageRequestSync, Pageable } from '@types';
import { ObjectId } from 'mongodb';
import { FilterOperators, FindManyOptions, MongoRepository } from 'typeorm';
import { Question } from '../entity/child-entity/question.entity';
import { SaveQuestionDto, SyncQuestionDto } from '../dto/question.dto';

@Injectable()
export class QuestionService extends BaseService<Question> {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: MongoRepository<Question>,
    private readonly log: LogService,
  ) {
    super(questionRepository, Question.name);
    this.log.setContext(QuestionService.name);
  }

  async saveQuestion(
    profile: Profile,
    payload: SaveQuestionDto,
    id?: ObjectId,
  ) {
    let question: Question;
    if (id) {
      question = await this.findOneCardWithDeletedTimeNull(
        profile._id,
        id,
        CardType.QUESTIONS,
      );
      delete payload._id;
      if (!question)
        throw new BadRequestException(
          `Question ${id.toString()} does not exist`,
        );
    } else {
      if (payload?._id) {
        const existNote = await this.findOneCardWithDeletedTimeNull(
          profile._id,
          payload._id,
          CardType.QUESTIONS,
        );
        if (existNote)
          throw new ConflictException(`Question ${payload._id} already exist`);
      }
      question = this.create(payload);
      question.profile = profile._id;
      question.cardType = CardType.QUESTIONS;
    }

    const data = await this.save({ ...question, ...payload });
    return data;
  }

  async getAll(profile: Profile, pageRequest: PageRequest) {
    const { page, size, skip, order, orderBy } = pageRequest;
    const filter: FindManyOptions<Question> = {
      where: {
        deletedTime: null,
        profile: profile._id,
        cardType: CardType.QUESTIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [questions, count] = await this.findAndCount(filter);
    return new Pageable(questions, { size, page, count });
  }

  async getAllSync(profile: Profile, pageRequest: PageRequestSync) {
    const { page, size, skip, order, orderBy, lastSyncTime } = pageRequest;
    const filter: FindManyOptions<Question> | FilterOperators<Question> = {
      where: {
        updatedTime: { $gt: lastSyncTime },
        profile: profile._id,
        cardType: CardType.QUESTIONS,
      },
      take: size,
      skip,
      order: { [orderBy]: order },
    };

    const [questions, count] = await this.findAndCountMongo(filter);
    const syncQuestions = questions.map(
      (question) => new SyncQuestionDto(question),
    );
    return new Pageable(syncQuestions, { size, page, count });
  }

  async getOne(profile: Profile, id: ObjectId) {
    const question = await this.findOneCardWithDeletedTimeNull(
      profile._id,
      id,
      CardType.QUESTIONS,
    );
    if (!question)
      throw new NotFoundException(`Question ${id.toString()} does not exist`);
    return question;
  }
}
