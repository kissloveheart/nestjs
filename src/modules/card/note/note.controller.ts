import { PROFILE_TOKEN } from '@constant';
import { Public } from '@decorators';
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
import { ObjectId } from 'mongodb';
import { ClsService } from 'nestjs-cls';
import {
  ApiResponseObject,
  ApiResponsePagination,
  PageRequest,
  PageRequestSync,
} from '@types';
import { NoteService } from './note.service';
import { Note } from '../entity/child-entity/note.entity';
import { SaveNoteDto, SyncNoteDto } from '../dto/note.dto';
import { CardType } from '@enum';
import { ProfileGuard } from '@guard';

@Controller('profile/:profileId/card/note')
@ApiTags('Note')
@Public()
@UseGuards(ProfileGuard)
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly cls: ClsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all notes of profile',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(Note)
  async getAll(@Query() pageRequest: PageRequest) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.noteService.getAll(profile, pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all notes of profile from last sync time',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponsePagination(SyncNoteDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.noteService.getAllSync(profile, pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get note by ID',
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
  @ApiResponseObject(Note)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.noteService.getOne(profile, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create note',
  })
  @ApiParam({
    name: 'profileId',
    required: true,
    type: String,
    example: '6500113c1895a06e02ab3d87',
  })
  @ApiResponseObject(Note)
  async createNote(@Body() payload: SaveNoteDto) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.noteService.saveNote(profile, payload);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update note',
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
  @ApiResponseObject(Note)
  async updateNote(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveNoteDto,
  ) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    return await this.noteService.saveNote(profile, payload, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete note by Id',
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
  async softDelete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    const profile = this.cls.get<Profile>(PROFILE_TOKEN);
    await this.noteService.softDeleteCard(profile._id, id, CardType.NOTES);
  }
}
