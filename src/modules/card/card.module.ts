import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardController } from './Card.controller';
import { CardService } from './Card.service';
import { Card } from './entity/Card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  controllers: [CardController],
  providers: [CardService],
})
export class CardModule {}
