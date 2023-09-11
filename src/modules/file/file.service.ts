import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { MongoRepository } from 'typeorm';
import { File } from './entity/File.entity';
import slugify from 'slugify';
import { Profile } from '@modules/profile';
import { User } from '@modules/user';
import { FileStatus } from '@enum';
import { UploadService } from '@shared/upload';

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: MongoRepository<File>,
    private readonly log: LogService,
    private readonly uploadService: UploadService,
  ) {
    super(fileRepository);
    this.log.setContext(FileService.name);
  }

  async upload(
    file: Express.Multer.File,
    user: User,
    profile?: Profile,
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
      user: user._id,
      ...(profile && {
        profile: profile._id,
      }),
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
