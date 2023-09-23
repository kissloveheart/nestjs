import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { booleanTransform, objectIdTransform } from '@transform';
import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, NotEquals } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Medication } from '../entity/child-entity/medication.entity';

export class LinkTopic {
  @ApiProperty({ type: String })
  @Type(() => ObjectId)
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  @Transform(({ value }) => objectIdTransform(value), { toClassOnly: true })
  @NotEquals(null)
  @Expose()
  _id: ObjectId;

  @ApiProperty()
  @ApiPropertyOptional()
  title?: string;

  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => booleanTransform(value))
  isLinked: boolean;

  constructor(partial: unknown) {
    Object.assign(this, partial);
  }
}

export class MedicationDto extends OmitType(Medication, [
  'topics',
  'profile',
  'attachments',
] as const) {
  @Type(() => LinkTopic)
  @ApiProperty({ type: LinkTopic, isArray: true })
  topics: LinkTopic[];

  constructor(partial: Partial<Medication>) {
    super();
    Object.assign(this, partial);
  }
}

export class SaveMedicationDto extends OmitType(Medication, [
  'topics',
  'profile',
  'cardType',
  'attachments',
] as const) {}

export class SyncMedicationDto extends OmitType(Medication, [
  'updatedTime',
  'deletedTime',
]) {
  @ApiProperty()
  updatedTime: Date;

  @ApiProperty()
  deletedTime: Date;

  constructor(partial: Partial<Medication>) {
    super();
    Object.assign(this, partial);
  }
}
