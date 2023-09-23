import { ChildEntity, Column } from 'typeorm';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { CardType, MedicationType } from '@enum';
import { Card } from '../card.entity';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { booleanTransform, enumTransform, stringToDate } from '@transform';

export class FillHistory {
  @Column()
  @IsDate()
  @ApiProperty({
    required: true,
    default: new Date(),
  })
  @Transform(({ value }) => stringToDate(value))
  fillDate: Date;

  @Column()
  @IsNumber()
  @ApiProperty()
  daySupply: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  ofFills: number;

  @Column()
  @IsNumber()
  @ApiProperty()
  cost: number;

  @Column()
  @IsString()
  @ApiProperty()
  location: string;
}
export class Prescription {
  @Column()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  @ApiProperty()
  prescription: boolean = false;

  @Column()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  @ApiProperty()
  takeAsNeeded: boolean = false;

  @Column()
  @ApiPropertyOptional({ type: FillHistory, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FillHistory)
  fill?: FillHistory[];

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => ObjectId)
  @Exclude()
  prescriber?: ObjectId[];
}

@ChildEntity(CardType.MEDICATIONS)
export class Medication extends Card {
  @Column()
  @IsEnum(MedicationType)
  @Transform(({ value }) => enumTransform(value, MedicationType))
  @ApiProperty({ enum: MedicationType })
  type: MedicationType;

  @Column()
  @IsString()
  @ApiProperty()
  instruction: string;

  @Column()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  @ApiProperty()
  activelyTaking: boolean = false;

  @Column()
  @IsString()
  @ApiProperty()
  reason: string;

  @Column()
  @IsNumber()
  @ApiProperty()
  dosage: number;

  @Column()
  @IsString()
  @ApiProperty()
  description: string;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Type(() => ObjectId)
  @Exclude()
  attachments?: ObjectId[];

  @Column()
  @ApiPropertyOptional({ type: Prescription, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Prescription)
  prescription?: Prescription[];
}
