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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@pipe';
import {
  ApiResponseObject,
  ApiResponsePagination,
  PageRequest,
  PageRequestSync,
} from '@types';
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';
import { QuestionService } from './question.service';
import { Question } from '../entity/child-entity/question.entity';
import { QuestionDto, SyncQuestionDto } from '../dto/question.dto';

@Controller('profile/:profileId/card/question')
@ApiTags('Question')
@Public()
@UseGuards(ProfileGuard)
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all questions of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Question)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.questionService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all questions of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncQuestionDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.questionService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get question by ID',
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
  @ApiResponseObject(Question)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.questionService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create question',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Question)
  async createQuestion(@Body() payload: QuestionDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.questionService.saveQuestion(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update question',
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
  @ApiResponseObject(Question)
  async updateQuestion(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: QuestionDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.questionService.saveQuestion(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete question by Id',
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
    await this.questionService.softDeleteCard(
      profile._id,
      id,
      CardType.QUESTIONS,
    );
  }
}
