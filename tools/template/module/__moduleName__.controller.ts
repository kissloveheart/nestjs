import { ParseObjectIdPipe } from '@pipe';
import { Controller, Get, Param } from '@nestjs/common';
import { ObjectId } from 'typeorm';
import { __moduleName__CamelCase__Service } from './__moduleName__.service';

@Controller('__moduleName__')
export class __moduleName__CamelCase__Controller {
	constructor(private readonly __moduleName__Service: __moduleName__CamelCase__Service) {}

	@Get()
	findAll() {
		return this.__moduleName__Service.find();
	}

	@Get(':id')
	findOne(@Param('id', ParseObjectIdPipe) id: ObjectId) {
		return this.__moduleName__Service.findById(id);
	}
}
