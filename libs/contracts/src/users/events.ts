export interface UserProfileCreatedEventDto {
  id: string;
  userAuthId: string;
  handle: string;
  email: string;
  avatar: string;
}

export interface UserProfileUpdatedEventDto {
  id: string;
  userAuthId: string;
  handle: string;
  email: string;
  avatar: string;
}

export interface UserProfileDeletedEventDto {
  id: string;
}
