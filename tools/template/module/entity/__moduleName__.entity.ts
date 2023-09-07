import { AuditEntity } from '@shared/base';
import { Entity } from 'typeorm';

@Entity({ name: '__moduleName__SnakeCase__' })
export class __moduleName__ extends AuditEntity {
  constructor(partial: Partial<__moduleName__>) {
    super();
    Object.assign(this, partial);
  }
}
