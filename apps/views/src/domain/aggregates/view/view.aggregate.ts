import { AggregateRoot } from '@nestjs/cqrs';

import { ViewEntity } from '@views/domain/entities';

import { ViewAggregateCreateOptions } from '../options';

export class ViewAggregate extends AggregateRoot {
  private constructor(private viewEntity: ViewEntity) {
    super();
  }

  public static create(data: ViewAggregateCreateOptions) {
    const { id, userId, videoId } = data;
    const view = ViewEntity.create({
      id,
      userId,
      videoId,
    });
    const viewAggregate = new ViewAggregate(view);
    return viewAggregate;
  }

  public getEntity() {
    return this.viewEntity;
  }

  public getSnapshot() {
    return this.viewEntity.getSnapshot();
  }
}
