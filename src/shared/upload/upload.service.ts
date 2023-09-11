import { Storage } from '@google-cloud/storage';
import { LogService } from '@log';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  private bucket;

  constructor(private readonly log: LogService) {
    this.bucket = new Storage().bucket('knk-bucket');
    this.log.setContext(UploadService.name);
  }

  async uploadFile(fileBuffer: Buffer, destination: string): Promise<string> {
    const file = this.bucket.file(destination);
    try {
      const filedUploaded = await file.save(fileBuffer, {
        metadata: {
          contentType: 'text/html',
          resumable: false,
          metadata: { url: 'example.com' },
        },
      });
      this.log.info('upload file success', filedUploaded);
    } catch (err) {
      this.log.error(err);
    }

    return `gs://knk-bucket/${destination}`;
  }
}
