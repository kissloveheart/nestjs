import { BaseEntity } from '@/modules/base/base.entity';
import mongoose, { HydratedDocument, Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '@/modules/user-roles/entities/user-role.entity';
import {
	Address,
	AddressSchema,
} from '@/modules/users/entities/address.entity';
import { FlashCard } from '@/modules/flash-cards/entities/flash-card.entity';
import { Collection } from '@/modules/collection/entities/collection.entity';
import { NextFunction } from 'express';
import {
	ArrayMinSize,
	IsArray,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	MaxLength,
	ValidateNested,
} from 'class-validator';
import { Exclude, Transform, Type } from 'class-transformer';

export type UserDocument = HydratedDocument<User>;

export enum GENDER {
	MALE = 'Male',
	FEMALE = 'Female',
	OTHER = 'Other',
}

@Schema({
	timestamps: true,
})
export class User extends BaseEntity {
	@Prop({ required: true, minlength: 2, maxlength: 60 })
	@IsNotEmpty()
	@MaxLength(50)
	firstName: string;

	@Prop({
		required: true,
		unique: true,
		match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,5})+$/,
		index: true,
	})
	@IsEmail()
	email: string;

	@Prop({
		match: /^([+]\d{2})?\d{10}$/,
	})
	@IsOptional()
	phoneNumber: string;

	@Prop({
		required: true,
	})
	@IsNotEmpty()
	@Exclude()
	password: string;

	@Prop({
		enum: GENDER,
		default: GENDER.OTHER,
	})
	@IsEnum(GENDER)
	gender: string;

	@Prop({ default: 0 })
	@IsOptional()
	@IsNumber()
	point: number;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: UserRole.name,
	})
	@Transform((value) => value.obj.role?.name, { toClassOnly: true })
	role: UserRole;

	@Prop({
		type: [{ type: AddressSchema }],
	})
	@IsOptional()
	@IsArray()
	@ArrayMinSize(1)
	@ValidateNested({ each: true })
	@Type(() => Address)
	address: Address[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const UserSchemaFactory = (
	flashCardModel: Model<FlashCard>,
	collectionModel: Model<Collection>,
) => {
	const userSchema = UserSchema;
	userSchema.pre('findOneAndDelete', async function (next: NextFunction) {
		// OTHER USEFUL METHOD: getOptions, getPopulatedPaths, getQuery = getFilter, getUpdate
		const user = await this.model.findOne(this.getFilter());
		await Promise.all([
			flashCardModel
				.deleteMany({
					user: user.id,
				})
				.exec(),
			collectionModel
				.deleteMany({
					user: user.id,
				})
				.exec(),
		]);
		return next();
	});
	return userSchema;
};
