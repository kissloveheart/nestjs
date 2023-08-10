import { Role } from '@modules/role';
import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
	Column,
	Entity,
	MongoBulkWriteError,
	ObjectId,
	ObjectIdColumn,
} from 'typeorm';
MongoBulkWriteError;

@Entity({ name: 'user' })
export class UserEntity extends AuditEntity {
	@Column()
	@IsString()
	@ApiProperty()
	firstName: string;

	@Column()
	@IsString()
	@ApiProperty()
	lastName: string;

	@Column()
	@IsEmail()
	@ApiProperty()
	email: string;

	@Column()
	phoneNumber: string;

	@Column()
	@IsNotEmpty()
	@Exclude()
	pin: number;

	@Column({ array: true })
	@Type(() => ObjectId)
	@Transform(({ value }) => value.map((value) => value.toString()))
	role_ids: ObjectId[];

	@Type(() => Role)
	@Column({ array: true, insert: false, update: false })
	roles?: Role[];

	constructor(partial: Partial<UserEntity>) {
		super();
		Object.assign(this, partial);
	}
}
