import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '@/modules/base/base.entity';

export type UserRoleDocument = HydratedDocument<UserRole>;

export enum USER_ROLE {
	ADMIN = 'Admin',
	USER = 'User',
}

@Schema({
	collection: 'user-roles',
	timestamps: true,
})
@Exclude()
export class UserRole extends BaseEntity {
	@Prop({
		unique: true,
		default: USER_ROLE.USER,
		enum: USER_ROLE,
		required: true,
	})
	@Expose({ name: 'role', toPlainOnly: true }) // Will not working with @Exclude decorate for class
	name: string;

	@Prop()
	description: string;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
