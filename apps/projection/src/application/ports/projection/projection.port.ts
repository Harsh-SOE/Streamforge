export interface ProjectionPort {
  isEventProcessed(eventId: string): Promise<boolean>;
  markEventAsProcessed(eventId: string): Promise<boolean>;
}
