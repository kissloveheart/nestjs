import { RoleName, UserStatus } from '@enum';
import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { enumTransform } from '@transform';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Column, Entity } from 'typeorm';

export class OTP {
  @Column()
  code: string;

  @Column()
  createdDate: Date = new Date();

  @Column()
  attempts: number = 0;

  @Column()
  consumed: boolean = false;

  @Column()
  consumedDate?: Date;
}

@Exclude()
export class SecurityInformation {
  @Column()
  pin?: string;

  @Column()
  salt?: string;

  @Column()
  pinUpdatedDate?: Date;

  @Column()
  failedPinCount: number = 0;

  @Column()
  @IsString()
  @MaxLength(100)
  @Expose()
  @ApiProperty()
  securityQuestion?: string;

  @Column()
  @IsString()
  @MaxLength(50)
  securityAnswer?: string;

  @Column()
  failedSecurityQuestionCount: number = 0;
}

@Entity({ name: 'user' })
export class User extends AuditEntity {
  @Column()
  @IsString()
  @ApiProperty()
  firstName: string;

  @Column()
  @IsString()
  @ApiProperty()
  lastName: string;

  @Column()
  @ApiProperty()
  @Transform(({ value }) => value?.trim().toLowerCase(), { toClassOnly: true })
  @IsEmail()
  email: string;

  @Column()
  @ApiProperty()
  @IsPhoneNumber('US')
  phoneNumber: string;

  @Column()
  @IsEnum(UserStatus)
  @ApiProperty()
  status: UserStatus = UserStatus.ACTIVE;

  @Column()
  @IsEnum(RoleName)
  @Transform(({ value }) => enumTransform(value, RoleName))
  @ApiProperty({ enum: RoleName })
  role: RoleName = RoleName.MEMBER;

  @Column()
  @Exclude()
  endSessionDate: Date = new Date();

  @Column()
  @ApiProperty()
  isSetupPin: boolean = false;

  @Column()
  @ApiProperty()
  isSetupSecurityQuestion: boolean = false;

  @Column()
  @ApiProperty()
  @IsBoolean()
  termsAccepted: boolean = false;

  @Column()
  @ApiProperty()
  @IsBoolean()
  ageAccepted: boolean = false;

  @Column()
  @IsOptional()
  fcm?: string[];

  @Column()
  totalFileSize: number = 0;

  @Column()
  @Type(() => OTP)
  @Exclude()
  @ValidateNested()
  otp?: OTP;

  @Column()
  @Type(() => SecurityInformation)
  @ApiProperty()
  @ValidateNested()
  securityInformation?: SecurityInformation;
}
