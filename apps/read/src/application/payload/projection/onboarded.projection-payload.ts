export interface UserOnBoardedProjection {
  userId: string;
  authId: string;
  handle: string;
  email: string;
  avatar: string;
  fullName?: string;
  phoneNumber?: string;
  isPhoneNumberVerified?: string;
  dob?: string;
}
