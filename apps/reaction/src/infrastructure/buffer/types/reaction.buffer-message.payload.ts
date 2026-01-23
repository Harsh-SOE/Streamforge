import { ReactionType } from '@app/contracts/reaction';

export interface ReactionBufferMessagePayload {
  userId: string;
  videoId: string;
  reactionStatus: ReactionType;
}
