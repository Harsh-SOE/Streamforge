export class UserNotificationStatusChangedEvent {
  public constructor(
    public readonly notificationStatusChangedEventDto: {
      id: string;
      status: boolean;
    },
  ) {}
}
