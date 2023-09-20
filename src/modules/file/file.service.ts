import { FileStatus } from '@enum';
import { LogService } from '@log';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from '@shared/base';
import { UploadService } from '@shared/upload';
import { ObjectId } from 'mongodb';
import slugify from 'slugify';
import { MongoRepository } from 'typeorm';
import { File } from './entity/file.entity';
import { AppConfigService } from '@config';

@Injectable()
export class FileService extends BaseService<File> {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: MongoRepository<File>,
    private readonly log: LogService,
    private readonly uploadService: UploadService,
    private readonly configService: AppConfigService,
  ) {
    super(fileRepository, File.name);
    this.log.setContext(FileService.name);
  }

  async upload(
    file: Express.Multer.File,
    user?: ObjectId,
    profile?: ObjectId,
    isAvatar = false,
  ): Promise<File> {
    const fileName = `${slugify(
      file.originalname.replace(/\.[^.]+$/, ''),
    )}_${Date.now()}.${file.originalname.split('.').pop()}`;

    const containerName = isAvatar
      ? this.configService.azure().storage.containerName + '-public'
      : this.configService.azure().storage.containerName;

    let newFile = this.create({
      name: fileName,
      container: containerName,
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
      const url = await this.uploadService.upload(
        file.buffer,
        fileName,
        containerName,
        newFile._id.toString(),
        isAvatar,
      );

      newFile = {
        ...newFile,
        status: FileStatus.UPLOADED,
        url,
      };

      return await this.save(newFile);
    } catch (err) {
      newFile.status = FileStatus.ERROR;
      await this.save(newFile);
      throw err;
    }
  }

  async softDeleteFile(id: ObjectId) {
    const file = await this.findOne({
      where: {
        _id: id,
        deletedTime: null,
      },
    });

    if (!file)
      throw new NotFoundException(`File ${id.toString()} does not exist`);

    await this.uploadService.delete(file.container, file.name);
    file.deletedTime = new Date();
    await this.save(file);
  }
}
