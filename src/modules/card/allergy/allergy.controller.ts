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
import { AllergyDto, SyncAllergyDto } from '../dto/allergy.dto';
import { Allergy } from '../entity/child-entity/allergy.entity';
import { AllergyService } from './allergy.service';

@Controller('profile/:profileId/card/allergy')
@ApiTags('Allergy')
@Public()
@UseGuards(ProfileGuard)
export class AllergyController {
  constructor(
    private readonly allergyService: AllergyService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all allergies of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Allergy)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.allergyService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all allergies of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncAllergyDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.allergyService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get allergy by ID',
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
  @ApiResponseObject(Allergy)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.allergyService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create allergy',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Allergy)
  async createAllergy(@Body() payload: AllergyDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.allergyService.saveAllergy(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update allergy',
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
  @ApiResponseObject(Allergy)
  async updateAllergy(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: AllergyDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.allergyService.saveAllergy(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete allergy by Id',
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
    await this.allergyService.softDeleteCard(
      profile._id,
      id,
      CardType.ALLERGIES,
    );
  }
}
