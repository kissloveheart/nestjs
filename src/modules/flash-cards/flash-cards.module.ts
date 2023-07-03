import { Module } from '@nestjs/common';
import { FlashCardsService } from './flash-cards.service';
import { FlashCardsController } from './flash-cards.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
	FlashCard,
	FlashCardSchema,
} from '@/modules/flash-cards/entities/flash-card.entity';
import { FlashCardsRepository } from '@/repositories/flash-cards.repository';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: FlashCard.name,
				schema: FlashCardSchema,
			},
		]),
	],
	controllers: [FlashCardsController],
	providers: [FlashCardsService, FlashCardsRepository],
})
export class FlashCardsModule {}
