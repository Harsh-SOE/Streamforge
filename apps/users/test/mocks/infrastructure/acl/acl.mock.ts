import { UserAggregateStub } from '@test/users/stubs/aggregate';
import { persistedUserStub } from '@test/users/stubs/persistance';

export const UserACLMock = () => ({
  toPersistance: jest.fn().mockReturnValue(persistedUserStub),
  toAggregate: jest.fn().mockReturnValue(UserAggregateStub),
});
