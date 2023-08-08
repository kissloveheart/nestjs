import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import {
	Column,
	CreateDateColumn,
	ObjectId,
	ObjectIdColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class AuditEntity {
	@ObjectIdColumn()
	@Transform(({ value }) => value.toString(), { toPlainOnly: true })
	id: ObjectId;

	@ApiHideProperty()
	@Exclude()
	@Column({ type: 'text', nullable: true })
	createdBy?: ObjectId;

	@ApiHideProperty()
	@Exclude()
	@CreateDateColumn()
	createdTime?: Date;

	@ApiHideProperty()
	@Exclude()
	@Column({ type: 'text', nullable: true })
	updatedBy?: ObjectId;

	@ApiHideProperty()
	@Exclude()
	@UpdateDateColumn()
	updatedTime?: Date;
}
