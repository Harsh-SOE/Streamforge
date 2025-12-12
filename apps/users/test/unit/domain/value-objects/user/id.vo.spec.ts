import { v4 as uuidv4 } from 'uuid';

import { UserId } from '@users/domain/value-objects';
import { InvalidIdException } from '@users/domain/exceptions';

describe('UserIdValueObject', () => {
  it('creates id value object from valid id', () => {
    const id = uuidv4();
    const userId = UserId.create(id);
    expect(userId.getValue()).toBe(id);
  });

  it('creates id value object from no id as input', () => {
    const userId = UserId.create();
    expect(userId.getValue()).toBeDefined();
  });

  it('should throw InvalidIdException for invalid id provided to it', () => {
    expect(() => UserId.create('invalid-id')).toThrow(InvalidIdException);
  });
});
