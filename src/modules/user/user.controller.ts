import { Public, RequiredRole } from '@decorators';
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
import { ApiResponsePagination, PageRequest } from '@types';
import { ObjectId } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { RoleName } from '../../types/enum/role.enum';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponsePagination(User)
  @ApiBearerAuth()
  @RequiredRole(RoleName.ADMIN)
  async findAll(@Query() pageRequest: PageRequest) {
    return await this.userService.getAll(pageRequest);
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
          phoneNumber: '8147320869',
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
