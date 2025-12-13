import { UserAggregate } from '@users/domain/aggregates';

export class UserOnboardingEvent {
  public constructor(public readonly user: UserAggregate) {}
}
