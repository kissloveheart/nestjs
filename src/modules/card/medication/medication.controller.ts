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
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
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
import { SaveMedicationDto, SyncMedicationDto } from '../dto/medication.dto';
import { TopicPayload } from '@modules/topic';
import { ProfileGuard } from '@guard';

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
  @ApiBody({
    type: SaveMedicationDto,
    examples: {
      medication: {
        value: {
          _id: 'string',
          title: 'string',
          isFollowedUp: true,
          startTime: '2023-09-22T07:27:37.408Z',
          endTime: '2023-09-22T07:27:37.408Z',
          type: 'Tablet',
          instruction: 'string',
          activelyTaking: true,
          reason: 'string',
          dosage: 0,
          description: 'string',
          prescription: [
            {
              prescription: true,
              takeAsNeeded: false,
              fill: [
                {
                  fillDate: '2023-09-22T07:27:37.408Z',
                  daySupply: 30,
                  ofFills: 3,
                  cost: 20,
                  location: 'new york',
                },
              ],
            },
          ],
        },
      },
    },
  })
  @ApiResponseObject(Medication)
  async createMedication(@Body() payload: SaveMedicationDto) {
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
  @ApiResponseObject(SaveMedicationDto)
  async updateMedication(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveMedicationDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.medicationService.saveMedication(profile, payload, id);
  }

  @Put(':id/topics')
  @ApiOperation({
    summary: 'Update topics',
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
  @ApiResponseObject(Medication)
  async updateMedicationTopics(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: TopicPayload,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.medicationService.updateMedicationTopics(
      profile,
      id,
      payload,
    );
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
