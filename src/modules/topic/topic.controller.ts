import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TopicService } from './topic.service';
import { ClsService } from 'nestjs-cls';
import {
  ApiResponseObject,
  ApiResponsePagination,
  PageRequest,
  PageRequestSync,
} from '@types';
import { Topic } from './entity/topic.entity';
import { Profile } from '@modules/profile';
import { PROFILE_TOKEN } from '@constant';
import {
  SyncTopicDto,
  TopicCreateDto,
  TopicDtoUpdateDto,
} from './dto/topic.dto';
import { ParseObjectIdPipe } from '@pipe';
import { ObjectId } from 'typeorm';
import { ProfileGuard } from '@modules/auth/guard';
import { Public } from '@decorators';

@Controller('profile/:profileId/topic')
@ApiTags('Topic')
@Public()
@UseGuards(ProfileGuard)
export class TopicController {
  constructor(
    private readonly topicService: TopicService,
    private readonly cls: ClsService,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Get all topics of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Topic)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.topicService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all topics of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncTopicDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.topicService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get topic by ID',
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
    example: '650156e338b8a56d37856604',
  })
  @ApiResponseObject(Topic)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.topicService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create topic',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Topic)
  async createTopic(@Body() payload: TopicCreateDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.topicService.saveTopic(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update topic',
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
    example: '65016e6f5622844ace07e5a2',
  })
  @ApiResponseObject(Topic)
  async updateTopic(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: TopicDtoUpdateDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.topicService.saveTopic(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete topic by Id',
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
    example: '65016e6f5622844ace07e5a2',
  })
  async softDelete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    await this.topicService.softDelete(id);
  }
}
