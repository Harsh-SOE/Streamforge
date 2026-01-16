import { UserReadModel } from '@read/application/models';

export interface UserQueryRepositoryPort {
  getUserFromId(userId: string): Promise<UserReadModel | null>;
  getUserFromAuthId(authId: string): Promise<UserReadModel | null>;
}

export const USER_QUERY_REPOSITORY_PORT = Symbol('USER_QUERY_REPOSITORY_PORT');
