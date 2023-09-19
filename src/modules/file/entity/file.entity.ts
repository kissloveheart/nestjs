import { FileStatus } from '@enum';
import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { Exclude } from 'class-transformer';
import { ObjectId } from 'mongodb';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'file' })
export class File extends AuditEntity {
  @Column()
  @Exclude()
  name: string;

  @Column()
  @Exclude()
  container: string;

  @Column()
  @ApiProperty()
  originalName: string;

  @ApiProperty({
    description: 'SAS url of Azure Blob Storage will be expired on next 7 days',
  })
  @Column()
  url?: string;

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
