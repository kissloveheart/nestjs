import { ClsService } from 'nestjs-cls';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import { AuditEntity } from '@shared/base';
import { LogService } from '@log';
import { SYSTEM, USER_TOKEN } from '@constant';

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface<AuditEntity> {
  constructor(
    dataSource: DataSource,
    private readonly cls: ClsService,
    private readonly log: LogService,
  ) {
    dataSource.subscribers.push(this);
    this.log.setContext(AuditSubscriber.name);
  }

  listenTo() {
    return AuditEntity;
  }

  beforeInsert(event: InsertEvent<AuditEntity>) {
    if (!event.entity)
      return this.log.warn(
        'Consider using .save() method because Subscriber can only be triggered that way',
      );
    const user = this.cls.get(USER_TOKEN);
    if (!event.entity.createdBy)
      event.entity.createdBy = user?._id.toString() ?? SYSTEM;
  }

  beforeUpdate(event: UpdateEvent<AuditEntity>) {
    if (!event.entity)
      return this.log.warn(
        'Consider using .save() method because Subscriber can only be triggered that way',
      );
    const user = this.cls.get(USER_TOKEN);
    event.entity.updatedBy = user?._id.toString() ?? SYSTEM;
  }
}
