import { CardType, InviteType } from '@enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { booleanTransform, enumTransform, stringToDate } from '@transform';
import { Exclude, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'temporary_share' })
export class TemporaryShare extends AuditEntity {
  @Column()
  @Type(() => ObjectId)
  @Exclude()
  profile: ObjectId;

  @Column()
  @IsEmail()
  @ApiProperty()
  @ValidateIf(({ value }) => value !== undefined)
  email?: string;

  @Column()
  @ApiProperty()
  @IsString()
  @ValidateIf(({ value }) => value !== undefined)
  phoneNumber?: string;

  @Column()
  @ApiProperty({ enum: InviteType })
  @IsEnum(InviteType)
  inviteType: InviteType;

  @Column()
  @ApiPropertyOptional()
  @IsDate()
  @Transform(({ value }) => stringToDate(value), { toClassOnly: true })
  expiredTime?: Date;

  @Column()
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  isExpired?: boolean = false;

  @Column()
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  isShowProfileBasic: boolean = false;

  @Column()
  @IsEnum(CardType, { each: true })
  @Transform(
    ({ value }) => value?.map((cardType) => enumTransform(cardType, CardType)),
    { toClassOnly: true },
  )
  @IsArray()
  @ApiPropertyOptional({ enum: CardType, isArray: true })
  cardType?: CardType[] = [];

  @Column()
  @Type(() => ObjectId)
  @ApiProperty({ type: String, isArray: true })
  @Transform(({ value }) => value?.map((e) => e.toString()))
  topics: ObjectId[] = [];
}
