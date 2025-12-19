import { AggregateRoot } from '@nestjs/cqrs';

import { ReactionEntity } from '../../entities/reaction/reaction.entity';
import { ReactionAggregateOption } from './options';

export class ReactionAggregate extends AggregateRoot {
  private constructor(private readonly reactionEntity: ReactionEntity) {
    super();
  }

  public static create(data: ReactionAggregateOption) {
    const { id, userId, videoId, reactionStatus } = data;
    const reactionEntity = ReactionEntity.create({ id, videoId, userId, reactionStatus });
    return new ReactionAggregate(reactionEntity);
  }

  public getSnapshot() {
    return this.reactionEntity.getSnapshot();
  }

  public getEntity() {
    return this.reactionEntity;
  }

  public updateReactionStatus(newReactionStatus: string) {
    return this.reactionEntity.updateReactionStatus(newReactionStatus);
  }
}
