import { Exclude, Type } from 'class-transformer';
import {
	ArrayMinSize,
	IsArray,
	IsEmail,
	IsNotEmpty,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AuditEntity } from './base/audit-entity';
import { Role } from './role.entity';

@Entity()
export class User extends AuditEntity {
	@Column()
	@IsString()
	firstName: string;

	@Column()
	@IsString()
	lastName: string;

	@Column({ unique: true })
	@IsEmail()
	email: string;

	@Column()
	phoneNumber: string;

	@Column()
	@IsNotEmpty()
	@Exclude()
	password: string;

	@Column()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => Role)
	address: Role[];

	constructor(partial: Partial<User>) {
		super();
		Object.assign(this, partial);
	}
}
