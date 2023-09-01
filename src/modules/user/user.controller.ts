import { Public } from '@decorators';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { EmailValidation, ParseObjectIdPipe } from '@pipe';
import { ApiResponseGeneric } from '@types';
import { ObjectId } from 'typeorm';
import { UserCreateDto } from './dto/user-create.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Public()
  @ApiResponseGeneric({ model: UserEntity })
  async findAll(@Query() user: UserCreateDto) {
    const data = await this.userService.find();
    return data;
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
  })
  @ApiResponseGeneric({ model: UserEntity })
  async findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
    return this.userService.findById(id);
  }

  @Post()
  async create(@Body() dto: UserCreateDto) {
    return await this.userService.create(dto);
  }

  @Get('check-exist-email')
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
}
