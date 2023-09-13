import { ChildEntity, Column } from 'typeorm';
import { IsArray, IsOptional, IsString } from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Card } from '../card.entity';
import { CardType } from '@enum';
import { Exclude } from 'class-transformer';

@ChildEntity(CardType.NOTES)
export class Note extends Card {
  @Column()
  @IsString()
  @ApiProperty()
  description: string;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiHideProperty()
  @Exclude()
  attachments?: ObjectId[];
}
