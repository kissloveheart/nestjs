import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'file' })
export class File extends AuditEntity {
  @Column()
  name: string;

  @Column()
  @ApiProperty()
  originalName: string;

  @Column()
  @ApiProperty()
  path: string;

  @Column()
  @ApiProperty()
  mineType: string;

  @Column()
  metadata: object;

  @Column()
  user: ObjectId;

  @Column()
  profile: ObjectId;

  constructor(partial: Partial<File>) {
    super();
    Object.assign(this, partial);
  }
}
