import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { IsString } from 'class-validator';
import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'topic' })
export class Topic extends AuditEntity {
  @Column()
  @IsString()
  @ApiProperty()
  title: string;

  @Column()
  profile: ObjectId;
}
