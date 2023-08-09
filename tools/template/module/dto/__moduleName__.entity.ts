import { Entity } from 'typeorm';
import { AuditEntity } from '@entities';

@Entity({ name: '__moduleName__' })
export class __moduleName__CamelCase__Entity extends AuditEntity {

	constructor(partial: Partial<__moduleName__CamelCase__Entity>) {
		super();
		Object.assign(this, partial);
	}
}
