import { UserEmail } from '@users/domain/value-objects';
import { InvalidEmailException } from '@users/domain/exceptions';

describe('UserEmailValueObject', () => {
  it('creates email value object from valid email', () => {
    const email = UserEmail.create('john.doe@example.com');
    expect(email.getValue()).toBe('john.doe@example.com');
  });

  it('should trim spaces and still work', () => {
    const email = UserEmail.create('   test@example.com   ');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw error if email is empty', () => {
    expect(() => UserEmail.create('')).toThrow(InvalidEmailException);
    expect(() => UserEmail.create('   ')).toThrow(InvalidEmailException);
  });

  it('should throw InvalidEmailException for invalid email', () => {
    expect(() => UserEmail.create('invalid-email')).toThrow(InvalidEmailException);
  });
});
