export interface UserQuery {
  userId: string;
  email: string;
  userAuthId: string;
  avatar: string;
  handle: string;
  phoneNumber?: string;
  isPhoneNumberVerified?: boolean;
  dob?: string;
}
