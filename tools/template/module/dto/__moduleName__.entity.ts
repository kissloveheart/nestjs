import { Entity } from 'typeorm';
import { AuditEntity } from '@shared';

@Entity({ name: '__moduleName__' })
export class __moduleName__CamelCase__Entity extends AuditEntity {
	constructor(partial: Partial<__moduleName__CamelCase__Entity>) {
		super();
		Object.assign(this, partial);
	}
}
