import { AggregateRoot } from '@nestjs/cqrs';

import { CommentEntity } from '../../entities';
import { CommentsAggregateOptions } from './options';

export class CommentAggregate extends AggregateRoot {
  private constructor(private comment: CommentEntity) {
    super();
  }

  public static create(data: CommentsAggregateOptions): CommentAggregate {
    const { id, userId, videoId, commentText } = data;
    const commentEntity = CommentEntity.create({ id, userId, videoId, commentText });
    return new CommentAggregate(commentEntity);
  }

  public getEntity() {
    return this.comment;
  }

  public getSnapshot() {
    return this.comment.getSnapshot();
  }
}
