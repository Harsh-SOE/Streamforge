import { UserLanguageChangedHandler } from './user-language-changed-event/user-language-changed.handler';
import { UserNotificationStatusChangedHandler } from './user-notification-status-changed-event/user-notification-status-changed.handler';
import { UserThemeChangedHandler } from './user-theme-changed-event/user-change-theme.handler';
import { UserProfileUpdatedHandler } from './user-profile-updated-event/user-profile-updated.handler';
import { UserPhoneNumberVerfiedHandler } from './user-phone-number-verified-event/user-phone-number-verified.handler';
import { UserProfileHandler } from './user-onboarded-event/user-onboarded.handler';

export const UserEventHandlers = [
  UserProfileHandler,
  UserLanguageChangedHandler,
  UserNotificationStatusChangedHandler,
  UserThemeChangedHandler,
  UserProfileUpdatedHandler,
  UserPhoneNumberVerfiedHandler,
];
