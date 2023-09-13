import { ChildEntity, Column } from 'typeorm';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { CardType } from '@enum';
import { Card } from '../card.entity';

@ChildEntity(CardType.ATTACHMENTS)
export class Attachment extends Card {
  @Column()
  @IsString()
  @ApiProperty()
  description: string;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  files?: ObjectId[];
}
