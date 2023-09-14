import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';
import { FileStatus } from '@enum';
import { formatUrlBucket } from '@utils';
import { Exclude, Transform } from 'class-transformer';

@Entity({ name: 'file' })
export class File extends AuditEntity {
  @Column()
  @Exclude()
  name: string;

  @Column()
  @ApiProperty()
  originalName: string;

  @Column()
  @ApiProperty()
  @Transform(({ value }) => formatUrlBucket(value), { toPlainOnly: true })
  path: string;

  @Column()
  @ApiProperty()
  mineType: string;

  @Column()
  @ApiProperty()
  size: number;

  @Column()
  @Exclude()
  status: FileStatus;

  @Column()
  @Exclude()
  user?: ObjectId;

  @Column()
  @Exclude()
  profile?: ObjectId;

  @Column()
  @ApiProperty()
  isAvatar: boolean = false;
}
