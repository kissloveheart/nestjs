import { CardType } from '@enum';
import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';

@ChildEntity(CardType.ATTACHMENTS)
export class Attachment extends Card {
  @Column()
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ required: false })
  description?: string;

  @Column()
  @IsOptional()
  @ApiHideProperty()
  @Exclude()
  files?: ObjectId[] = [];
}
