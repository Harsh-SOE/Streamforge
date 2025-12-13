import { UserGrpcThemePreferences } from '@app/contracts/users';

import { DomainThemePreference } from '@users/domain/enums';

export const DomainToGrpcThemePreferenceACL: Record<
  DomainThemePreference,
  UserGrpcThemePreferences
> = {
  [DomainThemePreference.SYSTEM]: UserGrpcThemePreferences.SYSTEM,
  [DomainThemePreference.LIGHT]: UserGrpcThemePreferences.LIGHT,
  [DomainThemePreference.DARK]: UserGrpcThemePreferences.DARK,
};
