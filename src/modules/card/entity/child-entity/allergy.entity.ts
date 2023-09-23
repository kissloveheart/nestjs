import { AllergySeverity, AllergyType, CardType } from '@enum';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { booleanTransform, enumTransform } from '@transform';

@ChildEntity(CardType.ALLERGIES)
export class Allergy extends Card {
  @Column()
  @IsEnum(AllergyType)
  @Transform(({ value }) => enumTransform(value, AllergyType))
  @ApiProperty({ enum: AllergyType })
  @IsOptional()
  type?: AllergyType;

  @Column()
  @IsEnum(AllergySeverity)
  @Transform(({ value }) => enumTransform(value, AllergySeverity))
  @ApiProperty({ enum: AllergySeverity })
  @IsOptional()
  allergySeverity?: AllergySeverity;

  @Column()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  @ApiProperty()
  @IsOptional()
  isNoLongerExperiencing: boolean = false;

  @Column()
  @IsString()
  @ApiProperty()
  @IsOptional()
  description?: string;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiHideProperty()
  @Exclude()
  practitioner?: ObjectId[];
}
