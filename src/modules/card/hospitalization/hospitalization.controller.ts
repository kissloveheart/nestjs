import { PROFILE_TOKEN } from '@constant';
import { Public } from '@decorators';
import { CardType } from '@enum';
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
import { HospitalizationService } from './hospitalization.service';
import { Hospitalization } from '../entity/child-entity/hospitalization.entity';
import { ProfileGuard } from '@guard';
import {
  SaveHospitalizationDto,
  SyncHospitalizationDto,
} from '../dto/hospitalization.dto';

@Controller('profile/:profileId/card/hospitalization')
@ApiTags('Hospitalization')
@Public()
@UseGuards(ProfileGuard)
export class HospitalizationController {
  constructor(
    private readonly hospitalizationService: HospitalizationService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all hospitalizations of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Hospitalization)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.hospitalizationService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all hospitalizations of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncHospitalizationDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.hospitalizationService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get hospitalization by ID',
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
  @ApiResponseObject(Hospitalization)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.hospitalizationService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create hospitalization',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Hospitalization)
  async createHospitalization(@Body() payload: SaveHospitalizationDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.hospitalizationService.saveHospitalization(
      profile,
      payload,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update hospitalization',
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
  @ApiResponseObject(Hospitalization)
  async updateHospitalization(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveHospitalizationDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.hospitalizationService.saveHospitalization(
      profile,
      payload,
      id,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete hospitalization by Id',
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
    await this.hospitalizationService.softDeleteCard(
      profile._id,
      id,
      CardType.HOSPITALIZATIONS,
    );
  }
}
