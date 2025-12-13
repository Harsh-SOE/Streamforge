import { UserNotificationChangedEventDto } from '@app/contracts/users';

export class UserNotificationStatusChangedEvent {
  public constructor(
    public readonly userNotificationChangedEventDto: UserNotificationChangedEventDto,
  ) {}
}
