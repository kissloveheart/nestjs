import { PartialType } from '@nestjs/swagger';
import { __moduleName__ } from '../entity/__moduleName__.entity';

export class __moduleName__CreateDto extends PartialType(__moduleName__) {}

export class __moduleName__DtoUpdateDto extends PartialType(
  __moduleName__CreateDto,
) {}
