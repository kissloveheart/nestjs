import { Public } from '@decorators';
import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EmailValidation, ParseObjectIdPipe, PinValidation } from '@pipe';
import { ApiResponseGeneric } from '@types';
import { ObjectId } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponseGeneric({ model: User })
  @ApiBearerAuth()
  async findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.userService.findById(id);
  }

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Signup',
  })
  @ApiBody({
    type: UserCreateDto,
    examples: {
      user: {
        value: {
          lastName: 'John',
          firstName: 'Herry',
          email: 'hiep.nguyenvan1@ncc.asia',
          phoneNumber: '1234567890',
          ageAccepted: true,
          termsAccepted: true,
        } as UserCreateDto,
      },
    },
  })
  async signup(@Body() payload: UserCreateDto) {
    await this.userService.signup(payload);
  }

  @Get('check-exist-email')
  @ApiOperation({
    summary: 'Check if email exists or not',
  })
  @Public()
  @ApiQuery({
    name: 'email',
    required: true,
    type: String,
    examples: {
      'hiep.nguyenvan1@ncc.asia': {
        value: 'hiep.nguyenvan1@ncc.asia',
      },
    },
  })
  async checkExistEmail(@Query('email', EmailValidation) email: string) {
    return await this.userService.checkExistEmail(email);
  }

  @Post('pin')
  @ApiOperation({
    summary: 'Create PIN',
  })
  @ApiQuery({
    name: 'pin',
    required: true,
    type: String,
    example: 1234,
  })
  @ApiBearerAuth()
  async createPin(@Query('pin', PinValidation) pin: string) {
    await this.userService.createPin(pin);
  }

  @Put('pin')
  @ApiOperation({
    summary: 'Verify PIN',
  })
  @ApiQuery({
    name: 'pin',
    required: true,
    type: String,
    example: 1234,
  })
  @ApiBearerAuth()
  async verifyPin(@Query('pin', PinValidation) pin: string) {
    await this.userService.verifyPin(pin);
  }
}
