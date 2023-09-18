import { CardType } from '@enum';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';

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
