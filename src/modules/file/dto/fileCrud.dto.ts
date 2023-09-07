import { PartialType } from '@nestjs/swagger';
import { File } from '../entity/File.entity';

export class FileCreateDto extends PartialType(File) {}

export class FileDtoUpdateDto extends PartialType(FileCreateDto) {}
