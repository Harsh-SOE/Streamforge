export interface VideoReactionEvent {
  eventId: string;
  occurredAt: string;
  videoId: string;
  userId: string;
  type: 'LIKED' | 'UNLIKED' | 'DISLIKED' | 'UNDISLIKED';
}
