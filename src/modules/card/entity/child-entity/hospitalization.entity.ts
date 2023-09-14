import { ChildEntity, Column } from 'typeorm';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { CardType, HospitalizationType } from '@enum';
import { Card } from '../card.entity';
import { Exclude, Transform } from 'class-transformer';
import { enumTransform } from '@transform';

@ChildEntity(CardType.HOSPITALIZATIONS)
export class Hospitalization extends Card {
  @Column()
  @IsEnum(HospitalizationType)
  @Transform(({ value }) => enumTransform(value, HospitalizationType))
  @ApiProperty({ enum: HospitalizationType })
  type: HospitalizationType;

  @Column()
  @IsString()
  @ApiProperty()
  description: string;

  @Column()
  @IsString()
  @ApiProperty()
  nurse: string;

  @Column()
  @IsString()
  @ApiProperty()
  location: string;

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
  attachments?: ObjectId[];
}
