import { Storage } from '@google-cloud/storage';
import { LogService } from '@log';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@config';

@Injectable()
export class UploadService {
  private bucket;

  constructor(
    private readonly log: LogService,
    private readonly configService: AppConfigService,
  ) {
    this.bucket = new Storage().bucket(this.configService.google().bucketName);
    this.log.setContext(UploadService.name);
  }

  async uploadFile(
    fileBuffer: Buffer,
    path: string,
    fileId: string,
  ): Promise<string> {
    const file = this.bucket.file(path);
    const filedUploaded = await file.save(fileBuffer, {
      metadata: {
        resumable: false,
        metadata: { fileId },
      },
    });

    await this.bucket.file(path).makePublic();
    this.log.debug('Upload file success', filedUploaded);

    return `${this.configService.google().bucketName}/${path}`;
  }
}
