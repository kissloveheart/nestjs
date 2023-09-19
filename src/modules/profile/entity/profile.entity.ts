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
import { faker } from '@faker-js/faker';

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

export class Test {
  @Column()
  @ApiProperty()
  subColumn1: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn2: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn3: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn4: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn5: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn6: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn7: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn8: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn9: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn10: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn11: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn12: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn13: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn14: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn15: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn16: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn17: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn18: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn19: string = faker.company.name();

  @Column()
  @ApiProperty()
  subColumn20: string = faker.company.name();
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
  avatar?: string;

  @Column()
  @ApiProperty()
  column1?: Test = new Test();

  @Column()
  @ApiProperty()
  column2?: Test = new Test();

  @Column()
  @ApiProperty()
  column3?: Test = new Test();

  @Column()
  @ApiProperty()
  column4?: Test = new Test();

  @Column()
  @ApiProperty()
  column5?: Test = new Test();

  @Column()
  @ApiProperty()
  column6?: Test = new Test();

  @Column()
  @ApiProperty()
  column7?: Test = new Test();

  @Column()
  @ApiProperty()
  column8?: Test = new Test();

  @Column()
  @ApiProperty()
  column9?: Test = new Test();

  @Column()
  @ApiProperty()
  column10?: Test = new Test();

  @Column()
  @ApiProperty()
  column11?: Test = new Test();

  @Column()
  @ApiProperty()
  column12?: Test = new Test();

  @Column()
  @ApiProperty()
  column13?: Test = new Test();

  @Column()
  @ApiProperty()
  column14?: Test = new Test();

  @Column()
  @ApiProperty()
  column15?: Test = new Test();

  @Column()
  @ApiProperty()
  column16?: Test = new Test();

  @Column()
  @ApiProperty()
  column17?: Test = new Test();

  @Column()
  @ApiProperty()
  column18?: Test = new Test();

  @Column()
  @ApiProperty()
  column19?: Test = new Test();

  @Column()
  @ApiProperty()
  column20?: Test = new Test();

  @Column()
  @ApiProperty()
  column21?: Test = new Test();

  @Column()
  @ApiProperty()
  column22?: Test = new Test();

  @Column()
  @ApiProperty()
  column23?: Test = new Test();

  @Column()
  @ApiProperty()
  column24?: Test = new Test();

  @Column()
  @ApiProperty()
  column25?: Test = new Test();

  @Column()
  @ApiProperty()
  column26?: Test = new Test();

  @Column()
  @ApiProperty()
  column27?: Test = new Test();

  @Column()
  @ApiProperty()
  column28?: Test = new Test();

  @Column()
  @ApiProperty()
  column29?: Test = new Test();

  @Column()
  @ApiProperty()
  column30?: Test = new Test();

  @Column()
  @ApiProperty()
  column31?: Test = new Test();

  @Column()
  @ApiProperty()
  column32?: Test = new Test();

  @Column()
  @ApiProperty()
  column33?: Test = new Test();

  @Column()
  @ApiProperty()
  column34?: Test = new Test();

  @Column()
  @ApiProperty()
  column35?: Test = new Test();

  @Column()
  @ApiProperty()
  column36?: Test = new Test();

  @Column()
  @ApiProperty()
  column37?: Test = new Test();

  @Column()
  @ApiProperty()
  column38?: Test = new Test();

  @Column()
  @ApiProperty()
  column39?: Test = new Test();

  @Column()
  @ApiProperty()
  column40?: Test = new Test();

  @Column()
  @ApiProperty()
  column41?: Test = new Test();

  @Column()
  @ApiProperty()
  column42?: Test = new Test();

  @Column()
  @ApiProperty()
  column43?: Test = new Test();

  @Column()
  @ApiProperty()
  column44?: Test = new Test();

  @Column()
  @ApiProperty()
  column45?: Test = new Test();

  @Column()
  @ApiProperty()
  column46?: Test = new Test();

  @Column()
  @ApiProperty()
  column47?: Test = new Test();

  @Column()
  @ApiProperty()
  column48?: Test = new Test();

  @Column()
  @ApiProperty()
  column49?: Test = new Test();

  @Column()
  @ApiProperty()
  column50?: Test = new Test();

  @Column()
  @ApiProperty()
  column51?: Test = new Test();

  @Column()
  @ApiProperty()
  column52?: Test = new Test();

  @Column()
  @ApiProperty()
  column53?: Test = new Test();

  @Column()
  @ApiProperty()
  column54?: Test = new Test();

  @Column()
  @ApiProperty()
  column55?: Test = new Test();

  @Column()
  @ApiProperty()
  column56?: Test = new Test();

  @Column()
  @ApiProperty()
  column57?: Test = new Test();

  @Column()
  @ApiProperty()
  column58?: Test = new Test();

  @Column()
  @ApiProperty()
  column59?: Test = new Test();

  @Column()
  @ApiProperty()
  column60?: Test = new Test();

  @Column()
  @ApiProperty()
  column61?: Test = new Test();

  @Column()
  @ApiProperty()
  column62?: Test = new Test();

  @Column()
  @ApiProperty()
  column63?: Test = new Test();

  @Column()
  @ApiProperty()
  column64?: Test = new Test();

  @Column()
  @ApiProperty()
  column65?: Test = new Test();

  @Column()
  @ApiProperty()
  column66?: Test = new Test();

  @Column()
  @ApiProperty()
  column67?: Test = new Test();

  @Column()
  @ApiProperty()
  column68?: Test = new Test();

  @Column()
  @ApiProperty()
  column69?: Test = new Test();

  @Column()
  @ApiProperty()
  column70?: Test = new Test();

  @Column()
  @ApiProperty()
  column71?: Test = new Test();

  @Column()
  @ApiProperty()
  column72?: Test = new Test();

  @Column()
  @ApiProperty()
  column73?: Test = new Test();

  @Column()
  @ApiProperty()
  column78?: Test = new Test();

  @Column()
  @ApiProperty()
  column79?: Test = new Test();

  @Column()
  @ApiProperty()
  column80?: Test = new Test();

  @Column()
  @ApiProperty()
  column81?: Test = new Test();

  @Column()
  @ApiProperty()
  column82?: Test = new Test();

  @Column()
  @ApiProperty()
  column83?: Test = new Test();

  @Column()
  @ApiProperty()
  column84?: Test = new Test();

  @Column()
  @ApiProperty()
  column85?: Test = new Test();

  @Column()
  @ApiProperty()
  column86?: Test = new Test();

  @Column()
  @ApiProperty()
  column87?: Test = new Test();

  @Column()
  @ApiProperty()
  column88?: Test = new Test();

  @Column()
  @ApiProperty()
  column89?: Test = new Test();

  @Column()
  @ApiProperty()
  column90?: Test = new Test();

  @Column()
  @ApiProperty()
  column91?: Test = new Test();

  @Column()
  @ApiProperty()
  column92?: Test = new Test();

  @Column()
  @ApiProperty()
  column93?: Test = new Test();

  @Column()
  @ApiProperty()
  column94?: Test = new Test();

  @Column()
  @ApiProperty()
  column95?: Test = new Test();

  @Column()
  @ApiProperty()
  column96?: Test = new Test();

  @Column()
  @ApiProperty()
  column97?: Test = new Test();

  @Column()
  @ApiProperty()
  column98?: Test = new Test();

  @Column()
  @ApiProperty()
  column99?: Test = new Test();

  @Column()
  @ApiProperty()
  column100?: Test = new Test();
}
