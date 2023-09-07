import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { File } from './entity/File.entity';

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: MongoRepository<File>,
    private readonly log: LogService,
  ) {
    super(fileRepository);
    this.log.setContext(FileService.name);
  }
}
