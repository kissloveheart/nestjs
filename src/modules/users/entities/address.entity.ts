import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseEntity } from '@/modules/base/base.entity';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

export type AddressDocument = HydratedDocument<Address>;

@Schema()
export class Address extends BaseEntity {
	@Prop({ required: false, minlength: 2, maxlength: 120 })
	street?: string;

	@Prop({ required: true, minlength: 2, maxlength: 50 })
	@IsString()
	state: string;

	@Prop({ required: true, minlength: 2, maxlength: 50 })
	@IsString()
	city: string;

	@Prop({ required: false, minlength: 2, maxlength: 50 })
	@IsOptional()
	@IsNumber()
	@Exclude()
	postalCode?: number;

	@Prop({ required: true, minlength: 2, maxlength: 50 })
	@IsString()
	country: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
