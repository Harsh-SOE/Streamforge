import { UserAggregate } from '@users/domain/aggregates';

export interface UserRepositoryPort {
  saveOneUser(userAggregate: UserAggregate): Promise<UserAggregate>;

  saveManyUsers(userAggregates: UserAggregate[]): Promise<number>;

  updateOneUserById(id: string, updates: UserAggregate): Promise<UserAggregate>;

  updateOneUserByAuthId(
    authId: string,
    updatedUserAggregate: UserAggregate,
  ): Promise<UserAggregate>;

  updateOneUserByHandle(
    handle: string,
    updatedUserAggregate: UserAggregate,
  ): Promise<UserAggregate>;

  deleteOneUserById(id: string): Promise<boolean>;

  deleteOneUserByAuthId(userAuthId: string): Promise<boolean>;

  deleteOneUserByHandle(userHandle: string): Promise<boolean>;

  findOneUserById(id: string): Promise<UserAggregate | null>;
}

export const USER_REROSITORY_PORT = Symbol('USER_REROSITORY_PORT');
