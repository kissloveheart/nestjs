import { RoleName } from '@enum';
import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared';
import { Exclude, Type } from 'class-transformer';
import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { Permission } from './permission.entity';

@Entity({
	name: 'role',
})
export class Role extends AuditEntity {
	@Column()
	@IsEnum(RoleName)
	@ApiProperty()
	name: RoleName;

	@Column()
	@Type(() => Permission)
	@ValidateNested({ each: true })
	@IsArray()
	permissions: Permission[];

	constructor(partial: Partial<Role>) {
		super();
		Object.assign(this, partial);
	}
}
