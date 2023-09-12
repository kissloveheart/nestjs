import { CardType } from '@enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { booleanTransform, stringToDate } from '@transform';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { Column, Entity, TableInheritance } from 'typeorm';

@Entity({ name: 'card' })
@TableInheritance()
export class Card extends AuditEntity {
  @Column()
  @IsString()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty()
  @IsEnum(CardType)
  cardType: CardType;

  @Column()
  profile: ObjectId;

  @Column()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  isFollowedUp: boolean = false;

  @Column()
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  @Transform(({ value }) => stringToDate(value))
  startTime?: Date;

  @Column()
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  @Transform(({ value }) => stringToDate(value))
  endTime?: Date;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  topics?: ObjectId[];
}
