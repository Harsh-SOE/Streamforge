import { DomainThemePreference } from '@users/domain/enums';

export class UserThemeChangedEvent {
  public constructor(
    public readonly changeThemeEventDto: {
      id: string;
      theme: DomainThemePreference;
    },
  ) {}
}
