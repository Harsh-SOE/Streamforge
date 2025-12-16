import { Profile } from 'passport-auth0';

export interface UserProfile {
  provider: string;
  providerId: string;
  email: string;
  fullName: string;
  avatar: string;
}

export type Auth0Profile = Profile & { picture?: string };
