import { ParseObjectIdPipe } from '@pipe';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { ObjectId } from 'typeorm';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiResponseGeneric } from '@types';
import { UserEntity } from './dto/user.entity';
import { UserCreateDto } from './dto/user-create.dto';
import { PermitActions, ScopePermission } from '@decorators';
import { Action, Scope } from '@enum';

@ApiTags('User')
@Controller('user')
@ApiBearerAuth()
@ScopePermission(Scope.USER)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@PermitActions(Action.READ)
	@ApiResponseGeneric({ model: UserEntity })
	async findAll() {
		const data = await this.userService.find({
			take: 1,
		});
		return data;
	}

	@Get(':id')
	@PermitActions(Action.READ)
	@ApiParam({
		name: 'id',
		type: 'string',
	})
	@ApiResponseGeneric({ model: UserEntity })
	async findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
		return this.userService.findById(id);
	}

	@Post()
	@PermitActions(Action.READ)
	async create(@Body() dto: UserCreateDto) {
		return await this.userService.create(dto);
	}

	@Put(':id')
	@PermitActions(Action.READ)
	@ApiParam({
		name: 'id',
		type: 'string',
	})
	async update(
		@Param('id', ParseObjectIdPipe) id: ObjectId,
		@Body() dto: UserCreateDto,
	) {
		throw new Error('Implement method');
	}

	@Delete(':id')
	@PermitActions(Action.READ)
	async delete(@Param('id', ParseObjectIdPipe) id: ObjectId) {
		await this.userService.delete(id);
	}
}
