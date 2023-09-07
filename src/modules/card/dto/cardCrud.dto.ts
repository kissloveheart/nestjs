import { PartialType } from '@nestjs/swagger';
import { Card } from '../entity/Card.entity';

export class CardCreateDto extends PartialType(Card) {}

export class CardDtoUpdateDto extends PartialType(CardCreateDto) {}
