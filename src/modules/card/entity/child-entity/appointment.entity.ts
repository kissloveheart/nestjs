import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { CardType } from '@enum';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@ChildEntity(CardType.APPOINTMENTS)
export class Appointment extends Card {
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
}
