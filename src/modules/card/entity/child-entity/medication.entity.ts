import { ChildEntity, Column } from 'typeorm';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { CardType, MedicationType } from '@enum';
import { Card } from '../card.entity';
import { Exclude, Transform } from 'class-transformer';
import { booleanTransform, enumTransform, stringToDate } from '@transform';

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
  @Exclude()
  attachments?: ObjectId[];

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Exclude()
  prescription?: Prescription[];
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
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Exclude()
  addFill?: AddFill[];

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  @Exclude()
  prescriber?: ObjectId[];
}

export class AddFill {
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
