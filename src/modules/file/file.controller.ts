import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileService } from './File.service';

@Controller('File')
@ApiTags('File')
export class FileController {
  constructor(private readonly fileService: FileService) {}
}
