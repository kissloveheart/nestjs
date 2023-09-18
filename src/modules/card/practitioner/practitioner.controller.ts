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
import {
  SavePractitionerDto,
  SyncPractitionerDto,
} from '../dto/practitioner.dto';
import { Practitioner } from '../entity/child-entity/practitioner.entity';
import { PractitionerService } from './practitioner.service';

@Controller('profile/:profileId/card/practitioner')
@ApiTags('Practitioner')
@Public()
@UseGuards(ProfileGuard)
export class PractitionerController {
  constructor(
    private readonly practitionerService: PractitionerService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all practitioners of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Practitioner)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.practitionerService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all practitioners of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncPractitionerDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.practitionerService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get practitioner by ID',
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
  @ApiResponseObject(Practitioner)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.practitionerService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create practitioner',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Practitioner)
  async createPractitioner(@Body() payload: SavePractitionerDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.practitionerService.savePractitioner(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update practitioner',
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
  @ApiResponseObject(Practitioner)
  async updatePractitioner(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SavePractitionerDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.practitionerService.savePractitioner(
      profile,
      payload,
      id,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete practitioner by Id',
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
    await this.practitionerService.softDeleteCard(
      profile._id,
      id,
      CardType.PRACTITIONERS,
    );
  }
}
