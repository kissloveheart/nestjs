import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '@/modules/users/entities/user.entity';
import { BaseEntity } from '@/modules/base/base.entity';

export enum COLLECTION_LEVEL {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
	CHAOS = 'chaos',
}

export type CollectionDocument = mongoose.HydratedDocument<Collection>;

@Schema()
export class Collection extends BaseEntity {
	@Prop({ required: true })
	name: string;

	@Prop()
	description: string;

	@Prop({ default: COLLECTION_LEVEL.EASY, enum: COLLECTION_LEVEL })
	level: COLLECTION_LEVEL;

	@Prop()
	order: number;

	@Prop()
	image: string;

	@Prop({ default: 0, min: 0 })
	totalFlashCards: number;

	@Prop({ default: false })
	isPublic: boolean;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: User.name,
		required: true,
	})
	user: User;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
