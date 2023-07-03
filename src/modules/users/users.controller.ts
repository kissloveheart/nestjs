import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseObjectIdPipe } from '@/pipe/objectid/parse-object-id.pipe';
import MongooseClassSerializerInterceptor from '@/interceptor/mongoose-class-serializer.interceptor';
import { User } from '@/modules/users/entities/user.entity';

@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseObjectIdPipe) id: string) {
		return this.usersService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseObjectIdPipe) id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseObjectIdPipe) id: string) {
		return this.usersService.remove(id);
	}
}
