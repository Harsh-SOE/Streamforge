export interface IntegrationEvent<TPayload> {
  eventName: string;
  eventType: string;
  eventVersion: number;
  eventId: string;
  occurredAt: string;
  payload: TPayload;
}
