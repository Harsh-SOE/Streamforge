import { UserAvatarUrl } from '@users/domain/value-objects';
import { InvalidAvatarUrlException } from '@users/domain/exceptions';

describe('UserIdValueObject', () => {
  it('creates avatar url value object from valid url', () => {
    const avatarUrl = UserAvatarUrl.create('https://avatar.com?avatar=test-avatar');
    expect(avatarUrl.getValue()).toBe('https://avatar.com?avatar=test-avatar');
  });

  it('should trim spaces and still work', () => {
    const userAvatar = UserAvatarUrl.create('   https://avatar.com?avatar=test-avatar   ');
    expect(userAvatar.getValue()).toBe('https://avatar.com?avatar=test-avatar');
  });

  it('should throw error if avatar is empty', () => {
    expect(() => UserAvatarUrl.create('')).toThrow(InvalidAvatarUrlException);
    expect(() => UserAvatarUrl.create('   ')).toThrow(InvalidAvatarUrlException);
  });

  it('should throw InvalidAvatarUrlException for invalid avatar provided to it', () => {
    expect(() => UserAvatarUrl.create('invalid-avatar')).toThrow(InvalidAvatarUrlException);
  });
});
