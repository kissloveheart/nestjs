import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { Card } from './entity/Card.entity';

@Injectable()
export class CardService extends BaseService<Card> {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: MongoRepository<Card>,
    private readonly log: LogService,
  ) {
    super(cardRepository);
    this.log.setContext(CardService.name);
  }
}
