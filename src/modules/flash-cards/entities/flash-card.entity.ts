import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { BaseEntity } from '@/modules/base/base.entity';
import { User } from '@/modules/users/entities/user.entity';
import { Topic } from '@/modules/topics/entities/topic.entity';

export type FlashCardDocument = mongoose.HydratedDocument<FlashCard>;

@Schema({
	collection: 'flash-cards',
	timestamps: true,
})
export class FlashCard extends BaseEntity {
	@Prop({ required: true })
	vocabulary: string;

	@Prop({ required: true })
	image: string;

	@Prop({ required: true })
	definition: string;

	@Prop({ required: true })
	meaning: string;

	@Prop()
	pronunciation?: string;

	@Prop({ default: [], type: [String] })
	examples: string[];

	@Prop({ default: false })
	isPublic: boolean;

	@Prop({
		type: mongoose.Schema.Types.ObjectId,
		ref: User.name,
		required: true,
	})
	user: User;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Topic.name }] })
	topics: Topic[];
}

export const FlashCardSchema = SchemaFactory.createForClass(FlashCard);
