import { UserAggregate } from '@users/domain/aggregates';
import { DomainThemePreference } from '@users/domain/enums';

export const UserAggregateStub = UserAggregate.create({
  userAuthId: 'mocked-auth-id',
  handle: 'handle',
  email: 'mocked@example.com',
  avatarUrl: 'https://test.com?avatar=mocked-avatar',
  isPhoneNumberVerified: false,
  region: 'IN',
  preferredTheme: DomainThemePreference.SYSTEM.toString(),
  preferredLanguage: 'en',
  notification: true,
  phoneNumber: undefined,
  dob: undefined,
});
