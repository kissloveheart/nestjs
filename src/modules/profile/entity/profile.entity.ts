import { BloodType, ProfileRole, Pronouns, Sex } from '@enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { booleanTransform, enumTransform } from '@transform';
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
  birthDate: Date;

  @Column()
  @IsEnum(Pronouns)
  @Transform(({ value }) => enumTransform(value, Pronouns))
  pronouns: Pronouns = Pronouns.HE;

  @Column()
  @IsEnum(Sex)
  @Transform(({ value }) => enumTransform(value, Sex))
  sex: Sex = Sex.MALE;

  @Column()
  @Matches(/^\d{3}-\d{2}-\d{4}$/)
  SSN: string;
}

export class EmergencyContact {
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
  @IsPhoneNumber('US')
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
  @ApiProperty()
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
  @ApiProperty()
  @IsEnum(ProfileRole)
  @Transform(({ value }) => enumTransform(value, ProfileRole))
  role: ProfileRole = ProfileRole.OWNER;
}

@Entity({ name: 'profile' })
export class Profile extends AuditEntity {
  @Column()
  owner: ObjectId;

  @Column()
  @ValidateNested()
  @Type(() => BasicInformation)
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
  deletedTime?: Date;

  @Column()
  avatar: string;

  constructor(partial: Partial<Profile>) {
    super();
    Object.assign(this, partial);
  }
}
