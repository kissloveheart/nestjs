import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { imageTypeFilter } from '@utils';
import { FileService } from './file.service';
import { Public } from '@decorators';

@Controller('File')
@ApiTags('File')
@ApiBearerAuth()
@Public()
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5000000,
      },
      fileFilter: imageTypeFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['image'],
    },
  })
  async uploadFile(
    @UploadedFile()
    image: Express.Multer.File,
    @Req() request,
  ) {
    return await this.fileService.upload(image);
  }
}
