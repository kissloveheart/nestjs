import { Prop } from '@nestjs/mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ObjectId } from 'mongoose';

export abstract class BaseEntity {
	_id?: ObjectId | string;

	@Expose()
	@Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
	id?: string;

	@Prop({ default: null })
	@Exclude({ toPlainOnly: true })
	deletedAt: Date;
}
