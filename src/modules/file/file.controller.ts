import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileService } from './File.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageTypeFilter } from '@utils';
import { User } from '@modules/user';

@Controller('File')
@ApiTags('File')
@ApiBearerAuth()
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
    await this.fileService.upload(image, request.user as User);
  }
}
