import { BloodType, ProfileRole, Pronouns, Sex } from '@enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { booleanTransform, enumTransform, stringToDate } from '@transform';
import { formatUrlBucket } from '@utils';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';

export class BasicInformation {
  @Column()
  @ApiProperty()
  @IsString()
  firstName: string;

  @Column()
  @ApiProperty()
  @IsString()
  lastName: string;

  @Column()
  @ApiPropertyOptional()
  @IsOptional()
  middleName?: string;

  @Column()
  @IsDate()
  @ApiPropertyOptional()
  @Transform(({ value }) => stringToDate(value))
  birthDate: Date;

  @Column()
  @IsEnum(Pronouns)
  @Transform(({ value }) => enumTransform(value, Pronouns))
  @ApiPropertyOptional({
    enum: Pronouns,
    default: Pronouns.HE,
  })
  pronouns: Pronouns = Pronouns.HE;

  @Column()
  @IsEnum(Sex)
  @Transform(({ value }) => enumTransform(value, Sex))
  @ApiPropertyOptional({
    enum: Sex,
    default: Sex.MALE,
  })
  sex: Sex = Sex.MALE;

  @Column()
  @Matches(/^\d{3}-\d{2}-\d{4}$/)
  @ApiPropertyOptional()
  SSN: string;
}

export class EmergencyContact {
  @Column()
  @ApiProperty()
  @Type(() => ObjectId)
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  _id: ObjectId = new ObjectId();

  @Column()
  @ApiProperty()
  @IsString()
  firstName: string;

  @Column()
  @ApiProperty()
  @IsString()
  lastName: string;

  @Column()
  @ApiProperty()
  @IsString()
  // @IsPhoneNumber('US')
  phoneNumber: string;
}

export class HealthDetail {
  @Column()
  @ApiProperty()
  @IsString()
  height: string;

  @Column()
  @ApiProperty()
  @IsString()
  weight: string;

  @Column()
  @ApiProperty({
    enum: BloodType,
    default: BloodType.UNKNOWN,
  })
  @IsEnum(BloodType)
  @Transform(({ value }) => enumTransform(value, BloodType))
  bloodType: BloodType = BloodType.UNKNOWN;

  @Column()
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  isOrganDonor: boolean = false;
}

export class Acl {
  @Column()
  accessor: ObjectId;

  @Column()
  @ApiProperty({
    enum: ProfileRole,
    default: ProfileRole.OWNER,
  })
  @IsEnum(ProfileRole)
  @Transform(({ value }) => enumTransform(value, ProfileRole))
  role: ProfileRole = ProfileRole.OWNER;
}

@Entity({ name: 'profile' })
export class Profile extends AuditEntity {
  @Column()
  @ApiProperty()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  owner: ObjectId;

  @Column()
  @ValidateNested()
  @Type(() => BasicInformation)
  @ApiProperty()
  basicInformation: BasicInformation;

  @Column()
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => Acl)
  acl?: Acl[];

  @Column()
  @ValidateNested()
  @ApiPropertyOptional()
  @Type(() => HealthDetail)
  healthDetail?: HealthDetail;

  @Column()
  @ApiPropertyOptional({ type: EmergencyContact, isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContact)
  emergencyContacts?: EmergencyContact[];

  @Column()
  @IsOptional()
  @ApiPropertyOptional()
  @Transform(({ value }) => formatUrlBucket(value))
  avatar?: string;
}
