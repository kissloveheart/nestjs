import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { CardType } from '@enum';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@ChildEntity(CardType.VACCINATIONS)
export class Vaccination extends Card {
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
  appointment?: ObjectId[];

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Exclude()
  attachments?: ObjectId[];
}
