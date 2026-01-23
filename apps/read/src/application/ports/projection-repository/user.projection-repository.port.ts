import { UserOnBoardedProjection } from '@read/application/payload/projection';

export interface UserProjectionRepositoryPort {
  saveUser(data: UserOnBoardedProjection): Promise<boolean>;

  saveManyUser(data: UserOnBoardedProjection[]): Promise<number>;

  // todo: make projection events for user updated and deleted
}

export const USER_PROJECTION_REPOSITORY_PORT = Symbol('USER_PROJECTION_REPOSITORY_PORT');
