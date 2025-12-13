import { UserThemeChangedEventDto } from '@app/contracts/users';

export class UserThemeChangedEvent {
  public constructor(public readonly userThemeChangedEventDto: UserThemeChangedEventDto) {}
}
