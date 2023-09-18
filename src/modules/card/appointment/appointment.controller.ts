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
import { AppointmentService } from './appointment.service';
import { Appointment } from '../entity/child-entity/appointment.entity';
import { SaveAppointmentDto, SyncAppointmentDto } from '../dto/appointment.dto';

@Controller('profile/:profileId/card/appointment')
@ApiTags('Appointment')
@Public()
@UseGuards(ProfileGuard)
export class AppointmentController {
  constructor(
    private readonly appointmentService: AppointmentService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all appointments of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Appointment)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.appointmentService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all appointments of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncAppointmentDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.appointmentService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
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
  @ApiResponseObject(Appointment)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.appointmentService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create appointment',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Appointment)
  async createAppointment(@Body() payload: SaveAppointmentDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.appointmentService.saveAppointment(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update appointment',
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
  @ApiResponseObject(Appointment)
  async updateAppointment(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveAppointmentDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.appointmentService.saveAppointment(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete appointment by Id',
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
    await this.appointmentService.softDeleteCard(
      profile._id,
      id,
      CardType.APPOINTMENTS,
    );
  }
}
