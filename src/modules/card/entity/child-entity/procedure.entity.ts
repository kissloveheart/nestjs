import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { CardType, ProcedureType } from '@enum';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { enumTransform } from '@transform';

@ChildEntity(CardType.PROCEDURES)
export class Procedure extends Card {
  @Column()
  @IsEnum(ProcedureType)
  @Transform(({ value }) => enumTransform(value, ProcedureType))
  @ApiProperty({ enum: ProcedureType })
  type: ProcedureType;

  @Column()
  @IsString()
  @ApiProperty()
  nurse: string;

  @Column()
  @IsString()
  @ApiProperty()
  location: string;

  @Column()
  @IsString()
  @ApiProperty()
  description: string;

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
  condition?: ObjectId[];

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Exclude()
  attachments?: ObjectId[];
}
