import { Controller, Delete, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { ParseObjectIdPipe } from '@pipe';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { Role } from './dto/role.entity';
import { ApiResponseGeneric } from '@types';
import { PermitActions, Public, ScopePermission } from '@decorators';
import { Action, Scope } from '@enum';

@Controller('role')
@ApiTags('Role')
@ApiBearerAuth()
@ScopePermission(Scope.ROLE)
@Public()
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@Get()
	@PermitActions(Action.READ)
	@ApiResponseGeneric({ model: Role })
	@Public()
	async getRoles() {
		const data = await this.roleService.findAndCount();
		return data;
	}

	@Get('count')
	@PermitActions(Action.MANAGE)
	async count() {
		return await this.roleService.count();
	}

	@Get(':id')
	@PermitActions(Action.READ)
	@ApiParam({
		name: 'id',
		type: 'string',
	})
	async getRole(@Param('id', ParseObjectIdPipe) id: string) {
		const data = await this.roleService.findById(new ObjectId(id));
		return data;
	}

	@Delete(':id')
	@PermitActions(Action.READ)
	@ApiParam({
		name: 'id',
		type: 'string',
	})
	async deleteRole(@Param('id') id: ObjectId) {
		return await this.roleService.delete(id);
	}
}
