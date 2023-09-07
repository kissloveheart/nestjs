import { AuditEntity } from '@shared/base';
import { Column, Entity, TableInheritance } from 'typeorm';
import { CardType } from '@enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { StringToDate, booleanTransform } from '@transform';

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
  @Transform(({ value }) => StringToDate(value))
  startTime?: Date;

  @Column()
  @IsDate()
  @IsOptional()
  @ApiPropertyOptional()
  @Transform(({ value }) => StringToDate(value))
  endTime?: Date;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  topics?: ObjectId[];

  constructor(partial: Partial<Card>) {
    super();
    Object.assign(this, partial);
  }
}
