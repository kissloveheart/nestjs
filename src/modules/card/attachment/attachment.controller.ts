import { PROFILE_TOKEN } from '@constant';
import { Public } from '@decorators';
import { CardType } from '@enum';
import { ProfileGuard } from '@guard';
import { Profile } from '@modules/profile';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@pipe';
import {
  ApiResponseObject,
  ApiResponsePagination,
  PageRequest,
  PageRequestSync,
} from '@types';
import { fileTypeFilter } from '@utils';
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';
import {
  AttachmentDto,
  SaveAttachmentDto,
  SyncAttachmentDto,
} from '../dto/attachment.dto';
import { Attachment } from '../entity/child-entity/attachment.entity';
import { AttachmentService } from './attachment.service';

@Controller('profile/:profileId/card/attachment')
@ApiTags('Attachment')
@Public()
@UseGuards(ProfileGuard)
export class AttachmentController {
  constructor(
    private readonly attachmentService: AttachmentService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all attachments of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Attachment)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.attachmentService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all attachments of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncAttachmentDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.attachmentService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get attachment by ID',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '650183f53cc4911902a7a490',
  })
  @ApiResponseObject(AttachmentDto)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.attachmentService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create attachment',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5000000,
      },
      fileFilter: fileTypeFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiResponseObject(Attachment)
  async createAttachment(
    @Body() payload: SaveAttachmentDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    payload.file = file;
    return await this.attachmentService.saveAttachment(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update attachment',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '6502849da171fd99e3717366',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5000000,
      },
      fileFilter: fileTypeFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiResponseObject(Attachment)
  async updateAttachment(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveAttachmentDto,
    @UploadedFile()
    file?: Express.Multer.File,
  ) {
    payload.file = file;
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.attachmentService.saveAttachment(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete attachment by Id',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '650183f53cc4911902a7a490',
  })
  async softDelete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    await this.attachmentService.softDeleteCard(
      profile._id,
      id,
      CardType.ATTACHMENTS,
    );
  }
}
