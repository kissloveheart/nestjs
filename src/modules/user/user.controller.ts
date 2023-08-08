import { ParseObjectIdPipe } from '@/common/pipe/parse-object-id.pipe';
import { Controller, Get, Param } from '@nestjs/common';
import { ObjectId } from 'typeorm';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	findAll() {
		return this.userService.find();
	}

	@Get(':id')
	findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
		return this.userService.findById(id);
	}
}
