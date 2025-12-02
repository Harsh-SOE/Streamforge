export interface VideoViewedEvent {
  eventId: string;
  occurredAt: string;
  videoId: string;
  userId?: string | null;
  watchedAt: string;
}
