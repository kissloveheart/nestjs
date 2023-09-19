import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { objectIdTransform } from '@transform';
import { IsOptional } from 'class-validator';

export abstract class AuditEntity {
  @ObjectIdColumn()
  @IsOptional()
  @Type(() => ObjectId)
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  @Transform(({ value }) => objectIdTransform(value), { toClassOnly: true })
  @ApiPropertyOptional({ type: String })
  _id: ObjectId;

  @ApiHideProperty()
  @Exclude()
  @Column()
  @Type(() => ObjectId)
  createdBy?: ObjectId;

  @ApiHideProperty()
  @Exclude()
  @CreateDateColumn()
  createdTime?: Date;

  @ApiHideProperty()
  @Exclude()
  @Column()
  @Type(() => ObjectId)
  updatedBy?: ObjectId;

  @ApiHideProperty()
  @Exclude()
  @UpdateDateColumn()
  updatedTime?: Date;

  @ApiHideProperty()
  @Exclude()
  @Column()
  deletedTime?: Date = null;

  @VersionColumn()
  @ApiHideProperty()
  @Exclude()
  __v?: number = 0;
}
