import { Injectable } from '@nestjs/common';
import { BaseRepositoryAbstract } from '@/repositories/base/base.abstract.repository';
import { FlashCard } from '@/modules/flash-cards/entities/flash-card.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class FlashCardsRepository extends BaseRepositoryAbstract<FlashCard> {
	constructor(
		@InjectModel(FlashCard.name)
		private readonly flashCardModel: Model<FlashCard>,
	) {
		super(flashCardModel);
	}
}
