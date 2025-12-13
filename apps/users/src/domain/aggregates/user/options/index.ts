export interface UserAggregateOption {
  id?: string;
  userAuthId: string;
  handle: string;
  email: string;
  avatarUrl: string;
  dob?: Date;
  phoneNumber?: string;
  isPhoneNumberVerified?: boolean;
  notification?: boolean;
  preferredTheme?: string;
  preferredLanguage?: string;
  region?: string;
}
