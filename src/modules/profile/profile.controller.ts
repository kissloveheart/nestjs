import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiResponseObject,
  ApiResponsePagination,
  PageRequest,
  PageRequestSync,
} from '@types';
import { Public } from '@decorators';
import { ParseObjectIdPipe } from '@pipe';
import { SaveProfileDto, SyncProfileDto } from './dto/profile.dto';
import { ObjectId } from 'mongodb';
import { BloodType, Pronouns } from '@enum';
import { Sex } from '@enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageTypeFilter } from '@utils';
import { Profile } from './entity/profile.entity';
import { ProfileService } from './profile.service';

@Controller('profile')
@ApiTags('Profile')
@Public()
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all profiles',
  })
  @ApiResponsePagination(Profile)
  async getAll(@Query() pageRequest: PageRequest) {
    return await this.profileService.getAll(pageRequest);
  }

  @Get('sync')
  @ApiOperation({
    summary: 'Get all profiles from last sync time',
  })
  @ApiResponsePagination(SyncProfileDto)
  async getAllSync(@Query() pageRequest: PageRequestSync) {
    return await this.profileService.getAllSync(pageRequest);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get profile by ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '64ffe83747f39d675a067299',
  })
  @ApiResponseObject(Profile)
  async getOneById(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return await this.profileService.findProfileWithOutDeletedTimeNull(id);
  }

  @Put(':id/avatar')
  @ApiOperation({
    summary: 'Change avatar profile',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['image'],
    },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '64ffe83747f39d675a067299',
  })
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 5000000,
      },
      fileFilter: imageTypeFilter,
    }),
  )
  async uploadFile(
    @Param('id', ParseObjectIdPipe) profileId: ObjectId,
    @UploadedFile()
    image: Express.Multer.File,
  ) {
    return await this.profileService.changeAvatar(profileId, image);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update profile',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '64ffe83747f39d675a067299',
  })
  @ApiBody({
    type: SaveProfileDto,
    examples: {
      profile: {
        value: {
          basicInformation: {
            firstName: 'Update',
            lastName: 'Update',
            middleName: 'Update',
            birthDate: new Date().toISOString(),
            pronouns: Pronouns.HE,
            sex: Sex.MALE,
            SSN: '123-45-6789',
          },
          healthDetail: {
            height: '100 cm',
            weight: '100 kg',
            bloodType: BloodType.UNKNOWN,
            isOrganDonor: true,
          },
          emergencyContacts: [
            {
              firstName: 'Update',
              lastName: 'Update',
              phoneNumber: '9433376809',
            },
          ],
        },
      },
    },
  })
  @ApiResponseObject(Profile)
  async update(
    @Param('id', ParseObjectIdPipe) id: ObjectId,
    @Body() payload: SaveProfileDto,
  ) {
    return await this.profileService.saveProfile(payload, id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create profile',
  })
  @ApiBody({
    type: SaveProfileDto,
    examples: {
      profile: {
        value: {
          basicInformation: {
            firstName: 'Create',
            lastName: 'Create',
            middleName: 'Create',
            birthDate: new Date().toISOString(),
            pronouns: Pronouns.HE,
            sex: Sex.MALE,
            SSN: '123-45-6789',
          },
          healthDetail: {
            height: '100 cm',
            weight: '100 kg',
            bloodType: BloodType.UNKNOWN,
            isOrganDonor: true,
          },
          emergencyContacts: [
            {
              firstName: 'Create',
              lastName: 'Create',
              phoneNumber: '9433376809',
            },
          ],
        },
      },
    },
  })
  @ApiResponseObject(Profile)
  async create(@Body() payload: SaveProfileDto) {
    return await this.profileService.saveProfile(payload);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Soft Delete profile',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    example: '64ffe83747f39d675a067299',
  })
  async softDelete(
    @Req() request,
    @Param('id', ParseObjectIdPipe) id: ObjectId,
  ) {
    await this.profileService.softDeleteProfile(request.user, id);
  }
}
