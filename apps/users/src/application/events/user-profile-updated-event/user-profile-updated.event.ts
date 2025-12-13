import { UserProfileUpdatedEventDto } from '@app/contracts/users';

export class UserProfileUpdatedEvent {
  public constructor(public readonly userProfileUpdatedEventDto: UserProfileUpdatedEventDto) {}
}
