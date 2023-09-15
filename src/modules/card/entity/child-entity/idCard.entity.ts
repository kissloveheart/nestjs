import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { CardType, IDCardType } from '@enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { enumTransform } from '@transform';

@ChildEntity(CardType.ID_CARD)
export class IDCard extends Card {
  @Column()
  @IsEnum(IDCardType)
  @Transform(({ value }) => enumTransform(value, IDCardType))
  @ApiProperty({ enum: IDCardType })
  type: IDCardType;

  @Column()
  @IsString()
  @ApiProperty()
  description: string;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Exclude()
  attachments?: ObjectId[];
}
