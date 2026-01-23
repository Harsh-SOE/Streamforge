import { DomainThemePreference } from '@users/domain/enums';

export interface UserOnBoardedBufferMessagePayload {
  id: string;
  userAuthId: string;
  handle: string;
  email: string;
  avatarUrl: string;
  dob?: string;
  phoneNumber?: string;
  isPhoneNumbetVerified: boolean;
  notification: boolean;
  themePreference: DomainThemePreference;
  languagePreference: string;
  region: string;
}
