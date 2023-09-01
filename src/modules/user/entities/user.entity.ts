import { RoleName, UserStatus } from '@enum';
import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { enumTransform } from '@transform';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
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
}

@Exclude()
export class SecurityInformation {
  @Column()
  @Length(4, 4)
  @IsNumberString()
  pin: string;

  @Column()
  pinUpdatedDate: Date;

  @Column()
  failedPinCount: number = 0;

  @Column()
  @IsString()
  @MaxLength(100)
  @Expose()
  @ApiProperty()
  securityQuestion: string;

  @Column()
  @IsString()
  @MaxLength(50)
  securityAnswer: string;

  @Column()
  failedSecurityQuestionCount: number = 0;
}

@Entity({ name: 'user' })
export class UserEntity extends AuditEntity {
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
  @Length(6, 6)
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
  @Type(() => OTP)
  @Exclude()
  otp?: OTP;

  @Column()
  @Type(() => SecurityInformation)
  @ApiProperty()
  securityInformation: SecurityInformation;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
