import { CommentId, CommentText, UserId, VideoId } from '../../value-objects';
import { CommentEntityCreateOptions, CommentEntityOptions, CommentSnapshot } from './options';

export class CommentEntity {
  public constructor(private readonly valueObjects: CommentEntityOptions) {}

  public static create(data: CommentEntityCreateOptions): CommentEntity {
    const { id, userId, videoId, commentText } = data;

    return new CommentEntity({
      id: CommentId.create(id),
      userId: UserId.create(userId),
      videoId: VideoId.create(videoId),
      commentText: CommentText.create(commentText),
    });
  }

  public getId(): string {
    return this.valueObjects.id.getValue();
  }

  public getUserId(): string {
    return this.valueObjects.userId.getValue();
  }

  public getVideoId(): string {
    return this.valueObjects.videoId.getValue();
  }

  public getCommentText(): string {
    return this.valueObjects.commentText.getValue();
  }

  public getSnapshot(): CommentSnapshot {
    return {
      id: this.valueObjects.id.getValue(),
      userId: this.valueObjects.userId.getValue(),
      videoId: this.valueObjects.videoId.getValue(),
      commentText: this.valueObjects.commentText.getValue(),
    };
  }

  public updateCommentText(newComment: string): CommentText {
    return CommentText.create(newComment);
  }
}
