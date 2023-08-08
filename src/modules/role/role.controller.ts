import { Controller, Delete, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { ParseObjectIdPipe } from '@/pipe/parse-object-id.pipe';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { ApiResponse } from '@/types/common.type';
import { Role } from '@/entities/role.entity';

@Controller('role')
@ApiTags('Albums')
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get()
	@ApiResponse({ model: Role })
	async getRoles() {
		return await this.roleService.findAndCount();
	}

	@Get('count')
	async count() {
		return await this.roleService.count();
	}

	@Get(':id')
	@ApiParam({
		name: 'id',
		type: 'string',
	})
	async getRole(@Param('id', ParseObjectIdPipe) id: string) {
		const data = await this.roleService.findById(new ObjectId(id));
		return data;
	}

	@Delete(':id')
	@ApiParam({
		name: 'id',
		type: 'string',
	})
	async deleteRole(@Param('id') id: ObjectId) {
		return await this.roleService.delete(id);
	}
}
