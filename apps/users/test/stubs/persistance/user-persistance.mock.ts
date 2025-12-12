import { v4 as uuidv4 } from 'uuid';

import { ThemePreferences, User } from '@peristance/user';

export const persistedUserStub: User = {
  id: uuidv4(),
  authUserId: 'mocked-auth-id',
  handle: 'handle',
  email: 'mocked@example.com',
  avatar: 'https://test.com?avatar=mocked-avatar',
  isPhoneNumberVerified: false,
  region: 'IN',
  themePreference: ThemePreferences.SYSTEM,
  languagePreference: 'en',
  notification: true,
  phoneNumber: null,
  dob: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};
