import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { __moduleName__Service } from './__moduleName__.service';

@Controller('__moduleName__lowerCase')
@ApiTags('__moduleName__')
export class __moduleName__Controller {
  constructor(
    private readonly __moduleName__CamelCase__Service: __moduleName__Service,
  ) {}
}
