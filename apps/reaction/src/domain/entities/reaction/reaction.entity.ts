import { ReactionDomainStatus } from '../../enums';
import { ReactionId, ReactionStatus, UserId, VideoId } from '../../value-objects';
import { ReactionCreateOption, ReactionEntityOption, ReactionSnapshot } from './options';

export class ReactionEntity {
  private constructor(private readonly valueObjects: ReactionEntityOption) {}

  public static create(data: ReactionCreateOption) {
    const { id, userId, videoId, reactionStatus } = data;
    return new ReactionEntity({
      id: ReactionId.create(id),
      reactionStatus: ReactionStatus.create(reactionStatus),
      userId: UserId.create(userId),
      videoId: VideoId.create(videoId),
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

  public getReactionStatus(): ReactionDomainStatus {
    return this.valueObjects.reactionStatus.getValue();
  }

  public getSnapshot(): ReactionSnapshot {
    return {
      id: this.valueObjects.id.getValue(),
      userId: this.valueObjects.userId.getValue(),
      videoId: this.valueObjects.videoId.getValue(),
      reactionStatus: this.valueObjects.reactionStatus.getValue(),
    };
  }

  public updateReactionStatus(newReactionStatus: string): ReactionStatus {
    return ReactionStatus.create(newReactionStatus);
  }
}
