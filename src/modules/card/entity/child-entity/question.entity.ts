import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { CardType, QuestionStatus } from '@enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { enumTransform } from '@transform';

@ChildEntity(CardType.QUESTIONS)
export class Question extends Card {
  @Column()
  @IsEnum(QuestionStatus)
  @Transform(({ value }) => enumTransform(value, QuestionStatus))
  @ApiProperty({ enum: QuestionStatus })
  status: QuestionStatus;

  @Column()
  @IsString()
  @ApiProperty()
  backgroundInfo: string;

  @Column()
  @IsString()
  @ApiProperty()
  answer: string;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiHideProperty()
  @Exclude()
  practitioner?: ObjectId[];

  @Column()
  @IsArray()
  @IsOptional()
  @ApiHideProperty()
  @Exclude()
  appointment?: ObjectId[];

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Exclude()
  attachments?: ObjectId[];
}
