import { UserLanguageChangedEventDto } from '@app/contracts/users';

export class UserLanguageChangedEvent {
  public constructor(public readonly userLanguageChangedEventDto: UserLanguageChangedEventDto) {}
}
