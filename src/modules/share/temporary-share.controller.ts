import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TemporaryShareService } from './temporary-share.service';
import { SaveTemporaryShareDto } from './dto/temporary-share.dto';
import { Public } from '@decorators';
import { ClsService } from 'nestjs-cls';
import { PROFILE_TOKEN } from '@constant';
import { Profile } from '@modules/profile';
import {
  ApiResponseObject,
  ApiResponsePagination,
  TemporarySharePageRequest,
} from '@types';
import { TemporaryShare } from './entity/temporary-share.entity';
import { ParseObjectIdPipe } from '@pipe';
import { ObjectId } from 'mongodb';
import { ProfileGuard } from '@guard';

@Controller('profile/:profileId/temporary-share')
@ApiTags('share')
@Public()
@UseGuards(ProfileGuard)
export class ShareController {
  constructor(
    private readonly shareService: TemporaryShareService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all temporary share of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '650a65fe94c9b3327ce80e6f',
  })
  @ApiResponsePagination(TemporaryShare)
  async getAll(@Query() pageRequest: TemporarySharePageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.shareService.getAll(profile, pageRequest);
  }

  @Post()
  @ApiOperation({
    summary: 'Create temporary share',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '650a65fe94c9b3327ce80e6f',
  })
  @ApiResponseObject(TemporaryShare)
  async createTemporaryShare(@Body() payload: SaveTemporaryShareDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.shareService.shareTemporaryShare(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update temporary share',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '650a65fe94c9b3327ce80e6f',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '650c09657d03ee3cf6fafa1c',
  })
  @ApiResponseObject(TemporaryShare)
  async updateTemporaryShare(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveTemporaryShareDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.shareService.saveTemporaryShare(profile, payload, id);
  }
}
