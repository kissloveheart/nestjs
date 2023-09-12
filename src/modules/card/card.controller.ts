import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardService } from './card.service';

@Controller('card')
@ApiTags('Card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
}
