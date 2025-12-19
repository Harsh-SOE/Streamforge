import { ReactionDomainStatus } from '@reaction/domain/enums';
import { ReactionId, ReactionStatus, UserId, VideoId } from '@reaction/domain/value-objects';

export interface ReactionEntityOption {
  readonly id: ReactionId;
  readonly userId: UserId;
  readonly videoId: VideoId;
  readonly reactionStatus: ReactionStatus;
}

export interface ReactionSnapshot {
  id: string;
  userId: string;
  videoId: string;
  reactionStatus: ReactionDomainStatus;
}

export interface ReactionCreateOption {
  id?: string;
  userId: string;
  videoId: string;
  reactionStatus: string;
}
