import { UserQuery } from '@read/application/payload/query';

export interface UserQueryRepositoryPort {
  getUserFromId(userId: string): Promise<UserQuery | null>;
  getUserFromAuthId(authId: string): Promise<UserQuery | null>;
}

export const USER_QUERY_REPOSITORY_PORT = Symbol('USER_QUERY_REPOSITORY_PORT');
