import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CardService } from './Card.service';

@Controller('Card')
@ApiTags('Card')
export class CardController {
  constructor(private readonly cardService: CardService) {}
}
