import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  ObjectIdColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

export abstract class AuditEntity {
  @ObjectIdColumn()
  @Transform(({ value }) => value.toString(), { toPlainOnly: true })
  @Type(() => ObjectId)
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
  deletedTime?: Date;

  @VersionColumn()
  @ApiHideProperty()
  __v?: number;
}
