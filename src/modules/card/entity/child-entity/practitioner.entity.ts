import { CardType, SpecialtyType } from '@enum';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { booleanTransform, enumTransform } from '@transform';

@ChildEntity(CardType.PRACTITIONERS)
export class Practitioner extends Card {
  @Column()
  @IsEnum(SpecialtyType)
  @ApiProperty({ enum: SpecialtyType })
  @Transform(({ value }) => enumTransform(value, SpecialtyType))
  specialty: SpecialtyType;

  @Column()
  @IsBoolean()
  @ApiProperty()
  @Transform(({ value }) => booleanTransform(value))
  isNoLongerSeeing: boolean = false;

  @Column()
  @IsString()
  @ApiProperty()
  phone: string;

  @Column()
  @IsString()
  @ApiProperty()
  fax: string;

  @Column()
  @IsUrl()
  @ApiProperty({
    example: 'http://google.com',
  })
  patientPortal: string;

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
  attachments?: ObjectId[];
}
