import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { __moduleName__ } from './entity/__moduleName__.entity';

@Injectable()
export class __moduleName__Service extends BaseService<__moduleName__> {
  constructor(
    @InjectRepository(__moduleName__)
    private readonly __moduleName__CamelCase__Repository: MongoRepository<__moduleName__>,
    private readonly log: LogService,
  ) {
    super(__moduleName__CamelCase__Repository);
    this.log.setContext(__moduleName__Service.name);
  }
}
