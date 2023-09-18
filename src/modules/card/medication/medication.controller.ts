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
import { MedicationService } from './medication.service';
import { Medication } from '../entity/child-entity/medication.entity';
import { MedicationDto, SyncMedicationDto } from '../dto/medication.dto';

@Controller('profile/:profileId/card/medication')
@ApiTags('Medication')
@Public()
@UseGuards(ProfileGuard)
export class MedicationController {
  constructor(
    private readonly medicationService: MedicationService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all medications of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Medication)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.medicationService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all medications of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncMedicationDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.medicationService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get medication by ID',
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
  @ApiResponseObject(Medication)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.medicationService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create medication',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Medication)
  async createMedication(@Body() payload: MedicationDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.medicationService.saveMedication(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update medication',
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
  @ApiResponseObject(MedicationDto)
  async updateMedication(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: MedicationDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.medicationService.saveMedication(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete medication by Id',
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
    await this.medicationService.softDeleteCard(
      profile._id,
      id,
      CardType.MEDICATIONS,
    );
  }
}
