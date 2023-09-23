import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { booleanTransform } from '@transform';
import { Transform } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';
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

  @Column()
  @IsBoolean()
  @ApiPropertyOptional({ required: false })
  @Transform(({ value }) => booleanTransform(value))
  isLinked?: boolean = false;
}
