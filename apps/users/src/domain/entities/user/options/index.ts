import { DomainThemePreference } from '@users/domain/enums';
import {
  UserAvatarUrl,
  UserDOB,
  UserEmail,
  UserHandle,
  UserId,
  UserLanguagePreference,
  UserPhoneNumber,
  UserRegion,
  UserThemePreference,
} from '@users/domain/value-objects';

export interface UserEntityOptions {
  readonly id: UserId;
  readonly userAuthId: string;
  readonly handle: UserHandle;
  email: UserEmail;
  avatarUrl: UserAvatarUrl;
  dob: UserDOB;
  phoneNumber: UserPhoneNumber;
  isPhoneNumberVerified: boolean;
  notification: boolean;
  themePreference: UserThemePreference;
  languagePreference: UserLanguagePreference;
  region: UserRegion;
}

export interface CreateUserEntityOptions {
  readonly id?: string;
  readonly userAuthId: string;
  readonly handle: string;
  email: string;
  avatarUrl: string;
  dob?: Date;
  phoneNumber?: string;
  isPhoneNumberVerified?: boolean;
  notification?: boolean;
  themePreference?: string;
  languagePreference?: string;
  region?: string;
}

export interface UserSnapshot {
  id: string;
  userAuthId: string;
  handle: string;
  email: string;
  avatarUrl: string;
  dob?: Date;
  phoneNumber?: string;
  isPhoneNumbetVerified: boolean;
  notification: boolean;
  themePreference: DomainThemePreference;
  languagePreference: string;
  region: string;
}
