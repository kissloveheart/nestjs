import { PartialType } from '@nestjs/swagger';
import { __moduleName__PascalCase__ } from '../entity/__moduleName__.entity';

export class __moduleName__CreateDto extends PartialType(__moduleName__PascalCase__) {}

export class __moduleName__DtoUpdateDto extends PartialType(
  __moduleName__CreateDto,
) {}
