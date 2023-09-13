import { FileStatus } from '@enum';
import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { UploadService } from '@shared/upload';
import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import { MongoRepository } from 'typeorm';
import { File } from './entity/file.entity';

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: MongoRepository<File>,
    private readonly log: LogService,
    private readonly uploadService: UploadService,
  ) {
    super(fileRepository, File.name);
    this.log.setContext(FileService.name);
  }

  async upload(
    file: Express.Multer.File,
    user?: ObjectId,
    profile?: ObjectId,
    isAvatar?: boolean,
  ): Promise<File> {
    const fileName = `${slugify(
      file.originalname.replace(/\.[^.]+$/, ''),
    )}_${Date.now()}.${file.originalname.split('.').pop()}`;

    let newFile = this.create({
      name: fileName,
      originalName: file.originalname,
      mineType: file.mimetype,
      size: file.size,
      status: FileStatus.UPLOADING,
      user,
      profile,
      isAvatar,
    });

    newFile = await this.save(newFile);

    try {
      const path = await this.uploadService.uploadFile(
        file.buffer,
        fileName,
        newFile._id.toString(),
      );

      newFile = {
        ...newFile,
        status: FileStatus.UPLOADED,
        path,
      };

      return await this.save(newFile);
    } catch (err) {
      newFile.status = FileStatus.ERROR;
      await this.save(newFile);
      throw err;
    }
  }
}
