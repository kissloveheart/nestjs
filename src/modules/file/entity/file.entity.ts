import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';
import { FileStatus } from '@enum';
import { formatUrlBucket } from '@utils';
import { Transform } from 'class-transformer';

@Entity({ name: 'file' })
export class File extends AuditEntity {
  @Column()
  name: string;

  @Column()
  @ApiProperty()
  originalName: string;

  @Column()
  @ApiProperty()
  @Transform(({ value }) => formatUrlBucket(value), { toPlainOnly: true })
  path: string;

  @Column()
  mineType: string;

  @Column()
  size: number;

  @Column()
  status: FileStatus;

  @Column()
  user: ObjectId;

  @Column()
  profile?: ObjectId;

  constructor(partial: Partial<File>) {
    super();
    Object.assign(this, partial);
  }
}
