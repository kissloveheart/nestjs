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
import { VaccinationService } from './vaccination.service';
import { Vaccination } from '../entity/child-entity/vaccination.entity';
import { SyncVaccinationDto, SaveVaccinationDto } from '../dto/vaccination.dto';

@Controller('profile/:profileId/card/vaccination')
@ApiTags('Vaccination')
@Public()
@UseGuards(ProfileGuard)
export class VaccinationController {
  constructor(
    private readonly vaccinationService: VaccinationService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all vaccination of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Vaccination)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.vaccinationService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all vaccinations of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncVaccinationDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.vaccinationService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get vaccination by ID',
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
  @ApiResponseObject(Vaccination)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.vaccinationService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create vaccination',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Vaccination)
  async createVaccination(@Body() payload: SaveVaccinationDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.vaccinationService.saveVaccination(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update vaccination',
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
  @ApiResponseObject(Vaccination)
  async updateVaccination(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveVaccinationDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.vaccinationService.saveVaccination(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete vaccination by Id',
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
    await this.vaccinationService.softDeleteCard(
      profile._id,
      id,
      CardType.VACCINATIONS,
    );
  }
}
