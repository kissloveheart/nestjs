import { Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from '@/services/base/base.abstract.service';
import { FlashCard } from '@/modules/flash-cards/entities/flash-card.entity';
import { FlashCardsRepository } from '@/repositories/flash-cards.repository';

@Injectable()
export class FlashCardsService extends BaseServiceAbstract<FlashCard> {
	constructor(private readonly flashcardsRepository: FlashCardsRepository) {
		super(flashcardsRepository);
	}
}
