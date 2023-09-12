import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { __moduleName__pascalCase__ } from './entity/__moduleName__.entity';

@Injectable()
export class __moduleName__pascalCase__Service extends BaseService<__moduleName__pascalCase__> {
  constructor(
    @InjectRepository(__moduleName__pascalCase__)
    private readonly __moduleName__CamelCase__Repository: MongoRepository<__moduleName__pascalCase__>,
    private readonly log: LogService,
  ) {
    super(__moduleName__CamelCase__Repository, __moduleName__pascalCase__);
    this.log.setContext(__moduleName__pascalCase__Service.name);
  }
}
