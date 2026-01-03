import { UserProfileHandler } from './onboarded-integration-event/onboarded.handler';
import { ThemeChangedHandler } from './theme-changed-integration-event/theme-changed.handler';
import { LanguageChangedHandler } from './language-changed-integration-event/language-changed.handler';
import { UserProfileUpdatedHandler } from './profile-updated-integration-event/user-profile-updated.handler';
import { PhoneNumberVerfiedHandler } from './phone-number-verified-integration-event/phone-number-verified.handler';
import { NotificationStatusChangedHandler } from './notification-status-changed-integration-event/user-notification-status-changed.handler';

export const UserEventHandlers = [
  UserProfileHandler,
  LanguageChangedHandler,
  NotificationStatusChangedHandler,
  ThemeChangedHandler,
  UserProfileUpdatedHandler,
  PhoneNumberVerfiedHandler,
];
