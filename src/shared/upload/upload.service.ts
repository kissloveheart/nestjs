import { BlobSASPermissions, BlobServiceClient } from '@azure/storage-blob';
import { AppConfigService } from '@config';
import { LogService } from '@log';
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as moment from 'moment';

@Injectable()
export class UploadService implements OnModuleInit {
  private blobServiceClient: BlobServiceClient;

  constructor(
    private readonly log: LogService,
    private readonly configService: AppConfigService,
  ) {
    this.log.setContext(UploadService.name);
  }

  async onModuleInit() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.configService.azure().storage.connectionString,
    );
  }

  async getContainerClient(containerName: string) {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();
    return containerClient;
  }

  async getContainerClientPublic(containerName: string) {
    const containerClient =
      this.blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({
      access: 'blob',
    });
    return containerClient;
  }

  async getBlobClient(
    containerName: string,
    blobName: string,
    isPublic = false,
  ) {
    if (isPublic) {
      return (
        await this.getContainerClientPublic(containerName)
      ).getBlockBlobClient(blobName);
    } else {
      return (await this.getContainerClient(containerName)).getBlockBlobClient(
        blobName,
      );
    }
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    containerName: string,
    fileId: string,
    isPublic = false,
  ): Promise<string> {
    try {
      const blobClient = await this.getBlobClient(
        containerName,
        fileName,
        isPublic,
      );
      const filedUploaded = await blobClient.uploadData(fileBuffer, {
        metadata: {
          file_id: fileId,
        },
      });

      this.log.debug('Upload file success', filedUploaded);
      return isPublic
        ? blobClient.url
        : await this.generateSasUrl(containerName, fileName);
    } catch (err) {
      this.log.error(err);
      throw err;
    }
  }

  async delete(containerName: string, fileName: string) {
    const blobClient = await this.getBlobClient(containerName, fileName);
    await blobClient.deleteIfExists();
  }

  async generateSasUrl(containerName: string, fileName: string) {
    const blobClient = await this.getBlobClient(containerName, fileName);
    const sasUrl = await blobClient.generateSasUrl({
      permissions: BlobSASPermissions.from({ read: true }),
      startsOn: new Date(),
      expiresOn: moment()
        .add(this.configService.azure().storage.sasExpiredDay, 'days')
        .toDate(),
    });
    return sasUrl;
  }
}
