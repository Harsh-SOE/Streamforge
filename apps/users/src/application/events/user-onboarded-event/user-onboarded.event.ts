import { UserProfileCreatedEventDto } from '@app/contracts/users';

export class UserOnboardingEvent {
  public constructor(public readonly userProfileCreatedEventDto: UserProfileCreatedEventDto) {}
}
