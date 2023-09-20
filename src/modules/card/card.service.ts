import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { Card } from './entity/card.entity';
import { ObjectId } from 'mongodb';
import { SYSTEM } from '@constant';

@Injectable()
export class CardService extends BaseService<Card> {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: MongoRepository<Card>,
    private readonly log: LogService,
  ) {
    super(cardRepository, Card.name);
    this.log.setContext(CardService.name);
  }

  async softDeleteCardOfProfile(userId: ObjectId, profileId: ObjectId) {
    this.cardRepository.updateMany(
      {
        profile: profileId,
        deletedTime: null,
      },
      {
        $set: {
          deletedTime: new Date(),
          updatedTime: new Date(),
          updatedBy: userId ? userId : SYSTEM,
        },
        $inc: { __v: 1 },
      },
    );
  }
}
