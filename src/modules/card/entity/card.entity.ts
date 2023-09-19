import { CardType } from '@enum';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { booleanTransform, enumTransform, stringToDate } from '@transform';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { Column, Entity, TableInheritance } from 'typeorm';

@Entity({ name: 'card' })
@TableInheritance({
  column: {
    name: 'cardType',
    type: 'string',
  },
})
export abstract class Card extends AuditEntity {
  @Column()
  @IsString()
  @ApiProperty()
  title: string;

  @Column()
  @ApiProperty({ enum: CardType })
  @IsEnum(CardType)
  @Transform(({ value }) => enumTransform(value, CardType))
  cardType: CardType;

  @Column()
  @Type(() => ObjectId)
  @ApiProperty({ type: String })
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  profile: ObjectId;

  @Column()
  @IsBoolean()
  @ApiPropertyOptional({ required: false })
  @Transform(({ value }) => booleanTransform(value))
  isFollowedUp?: boolean = false;

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
  @ApiHideProperty()
  @Type(() => ObjectId)
  topics?: ObjectId[];
}
