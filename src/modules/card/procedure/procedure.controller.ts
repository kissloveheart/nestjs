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
import { ProcedureService } from './procedure.service';
import { Procedure } from '../entity/child-entity/procedure.entity';
import { SaveProcedureDto, SyncProcedureDto } from '../dto/procedure.dto';
import { ProfileGuard } from '@guard';

@Controller('profile/:profileId/card/procedure')
@ApiTags('Procedure')
@Public()
@UseGuards(ProfileGuard)
export class ProcedureController {
  constructor(
    private readonly procedureService: ProcedureService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all procedures of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Procedure)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.procedureService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all procedures of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncProcedureDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.procedureService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get procedure by ID',
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
  @ApiResponseObject(Procedure)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.procedureService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create procedure',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Procedure)
  async createProcedure(@Body() payload: SaveProcedureDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.procedureService.saveProcedure(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update procedure',
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
  @ApiResponseObject(Procedure)
  async updateProcedure(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveProcedureDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.procedureService.saveProcedure(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete procedure by Id',
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
    await this.procedureService.softDeleteCard(
      profile._id,
      id,
      CardType.PROCEDURES,
    );
  }
}
