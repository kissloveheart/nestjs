import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileController } from './File.controller';
import { FileService } from './File.service';
import { File } from './entity/File.entity';
import { UploadModule } from '@shared/upload';

@Module({
  imports: [TypeOrmModule.forFeature([File]), UploadModule],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
