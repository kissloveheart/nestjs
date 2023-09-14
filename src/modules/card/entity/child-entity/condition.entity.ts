import { ChildEntity, Column } from 'typeorm';
import { Card } from '../card.entity';
import { CardType, ConditionSeverity, ConditionType } from '@enum';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { booleanTransform, enumTransform } from '@transform';

@ChildEntity(CardType.CONDITIONS)
export class Condition extends Card {
  @Column()
  @IsEnum(ConditionType)
  @Transform(({ value }) => enumTransform(value, ConditionType))
  @ApiProperty({ enum: ConditionType })
  type: ConditionType;

  @Column()
  @IsEnum(ConditionSeverity)
  @Transform(({ value }) => enumTransform(value, ConditionSeverity))
  @ApiProperty({ enum: ConditionSeverity })
  conditionSeverity: ConditionSeverity;

  @Column()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  @ApiProperty()
  isNoLongerExperiencing: boolean = false;

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
