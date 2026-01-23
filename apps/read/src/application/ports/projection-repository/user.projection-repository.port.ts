import { ProfileUpdatedIntegrationEvent } from '@app/common/events/users';
import { UserOnBoardedProjection } from '@read/application/payload/projection';

export interface UserProjectionRepositoryPort {
  saveUser(data: UserOnBoardedProjection): Promise<boolean>;

  saveManyUser(data: UserOnBoardedProjection[]): Promise<number>;

  updateUser(userId: string, data: Partial<ProfileUpdatedIntegrationEvent>): Promise<boolean>;

  deleteUser(userId: string): Promise<boolean>;
}

export const USER_PROJECTION_REPOSITORY_PORT = Symbol('USER_PROJECTION_REPOSITORY_PORT');
