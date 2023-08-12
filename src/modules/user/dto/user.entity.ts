import { UserStatus } from '@enum';
import { Role } from '@modules/role';
import { ApiProperty } from '@nestjs/swagger';
import { AuditEntity } from '@shared/base';
import { enumTransform } from '@transform';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Column, Entity, ObjectId } from 'typeorm';

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
	@IsString()
	@Exclude()
	pin: string;

	@Column()
	@IsEnum(UserStatus)
	@Transform(({ value }) => enumTransform(value, UserStatus))
	status: UserStatus;

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
