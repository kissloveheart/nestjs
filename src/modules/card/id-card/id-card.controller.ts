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
import { IDCard } from '../entity/child-entity/idCard.entity';
import { SaveIDCardDto, SyncIDCardDto } from '../dto/id-card.dto';
import { IDCardService } from './id-card.service';

@Controller('profile/:profileId/card/id-card')
@ApiTags('ID Card')
@Public()
@UseGuards(ProfileGuard)
export class IDCardController {
  constructor(
    private readonly idCardService: IDCardService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all idCards of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(IDCard)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.idCardService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all idCards of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncIDCardDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.idCardService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get idCard by ID',
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
  @ApiResponseObject(IDCard)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.idCardService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create idCard',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(IDCard)
  async createIDCard(@Body() payload: SaveIDCardDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.idCardService.saveIDCard(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update idCard',
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
  @ApiResponseObject(IDCard)
  async updateIDCard(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveIDCardDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.idCardService.saveIDCard(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete idCard by Id',
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
    await this.idCardService.softDeleteCard(profile._id, id, CardType.ID_CARD);
  }
}
