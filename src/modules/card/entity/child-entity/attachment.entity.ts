import { ChildEntity, Column } from 'typeorm';
import { Card } from '../Card.entity';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

@ChildEntity()
export class Attachment extends Card {
  @Column()
  @IsString()
  @ApiProperty()
  description: string;

  @Column()
  @IsArray()
  @IsOptional()
  @ApiPropertyOptional()
  files?: ObjectId[];
}
