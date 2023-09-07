import { RoleName, UserStatus } from '@enum';
import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { enumTransform } from '@transform';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  MaxLength,
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

  constructor(partial: Partial<OTP>) {
    Object.assign(this, partial);
  }
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

  constructor(partial: Partial<SecurityInformation>) {
    Object.assign(this, partial);
  }
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
  @IsEmail()
  @ApiProperty()
  email: string;

  @Column()
  @IsNumberString()
  @Length(10, 10)
  @ApiProperty()
  phoneNumber: string;

  @Column()
  @IsEnum(UserStatus)
  @ApiProperty()
  status: UserStatus = UserStatus.ACTIVE;

  @Column()
  @IsEnum(RoleName)
  @Transform(({ value }) => enumTransform(value, RoleName))
  @ApiProperty()
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
  @Type(() => OTP)
  @Exclude()
  otp?: OTP;

  @Column()
  @Type(() => SecurityInformation)
  @ApiProperty()
  securityInformation?: SecurityInformation;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
