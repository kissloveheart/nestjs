import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { __moduleName__PascalCase__ } from './entity/__moduleName__.entity';

@Injectable()
export class __moduleName__PascalCase__Service extends BaseService<__moduleName__PascalCase__> {
  constructor(
    @InjectRepository(__moduleName__PascalCase__)
    private readonly __moduleName__CamelCase__Repository: MongoRepository<__moduleName__PascalCase__>,
    private readonly log: LogService,
  ) {
    super(__moduleName__CamelCase__Repository, __moduleName__PascalCase__.name);
    this.log.setContext(__moduleName__PascalCase__Service.name);
  }
}
