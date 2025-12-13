import { UserEntity } from '@users/domain/entities';
import {
  InvalidAvatarUrlException,
  InvalidDobException,
  InvalidEmailException,
  InvalidLanguaugePreferenceException,
  InvalidPhoneNumberException,
} from '@users/domain/exceptions';

describe('UserEntity', () => {
  let userEntity: UserEntity;
  beforeEach(() => {
    userEntity = UserEntity.create({
      userAuthId: 'authId',
      handle: 'Handle',
      email: 'test@example.com',
      avatarUrl: 'https://test-avatar.com?avatar=test-avatar',
    });
  });

  describe('Create', () => {
    it('should create user entity when valid input are given', () => {
      const userEntity = UserEntity.create({
        userAuthId: 'authId',
        handle: 'handle',
        avatarUrl: 'https://test-avatar.com?avatar=test-avatar',
        email: 'test@example.com',
      });
      expect(userEntity).toBeInstanceOf(UserEntity);
    });

    it('should fail and throw InvalidEmailException when invalid email was provided', () => {
      expect(() =>
        UserEntity.create({
          userAuthId: 'authId',
          handle: 'handle',
          avatarUrl: 'https://test-avatar.com?avatar=test-avatar',
          email: 'invalid-email',
        }),
      ).toThrow(InvalidEmailException);
    });

    it('should fail and throw InvalidAvatarUrlException when invalid url was provided', () => {
      expect(() =>
        UserEntity.create({
          userAuthId: 'authId',
          handle: 'handle',
          avatarUrl: 'invalid-url',
          email: 'test@example.com',
        }),
      ).toThrow(InvalidAvatarUrlException);
    });
  });

  describe('UserEmail', () => {
    it('should update email, if valid email was provided', () => {
      userEntity.updateEmail('updated@example.com');
      expect(userEntity.getEmail()).toBe('updated@example.com');
    });

    it('should throw InvalidEmailException if invalid email was provided', () => {
      expect(() => userEntity.updateEmail('invalid-email')).toThrow(InvalidEmailException);
    });

    it('should throw InvalidEmailException if empty email was provided', () => {
      expect(() => userEntity.updateEmail('')).toThrow(InvalidEmailException);
      expect(() => userEntity.updateEmail('  ')).toThrow(InvalidEmailException);
    });
  });

  describe('UserAvatar', () => {
    it('should update avatarUrl when valid AvatarUrl was provided', () => {
      userEntity.updateAvatar('https://test-avatar.com?avatar=updated-avatar');
      expect(userEntity.getAvatarUrl()).toBe('https://test-avatar.com?avatar=updated-avatar');
    });

    it('should throw InvalidAvatarUrlException if invalid avatar was provided', () => {
      expect(() => userEntity.updateAvatar('invalid-avatar')).toThrow(InvalidAvatarUrlException);
    });

    it('should throw InvalidAvatarUrlException if empty avatarUrl was provided', () => {
      expect(() => userEntity.updateAvatar('')).toThrow(InvalidAvatarUrlException);
      expect(() => userEntity.updateAvatar('  ')).toThrow(InvalidAvatarUrlException);
    });
  });

  describe('UserDOB', () => {
    it('should update DOB when valid DOB was provided', () => {
      const date = new Date();
      date.setFullYear(date.getFullYear() - 20);
      userEntity.updateDOB(date);
      expect(userEntity.getDob()).toBe(date);
    });

    it('should throw InvalidDOBException if invalid dob less than 18 was provided', () => {
      expect(() => {
        const current = new Date();
        userEntity.updateDOB(current);
      }).toThrow(InvalidDobException);
    });
  });

  describe('UserPhoneNumber', () => {
    it('should update PhoneNumber when valid PhoneNumber was provided', () => {
      userEntity.updatePhoneNumber('+919876543210');
      expect(userEntity.getPhoneNumber()).toBe('+919876543210');
    });

    it('should throw InvalidPhoneNumberException when invalid PhoneNumber was provided', () => {
      expect(() => userEntity.updatePhoneNumber('invalid-phone-number')).toThrow(
        InvalidPhoneNumberException,
      );
    });

    it('should throw InvalidPhoneNumberException when empty PhoneNumber was provided', () => {
      expect(() => userEntity.updatePhoneNumber('')).toThrow(InvalidPhoneNumberException);
      expect(() => userEntity.updatePhoneNumber('  ')).toThrow(InvalidPhoneNumberException);
    });

    it('should update the phoneNumber by trimming spaces', () => {
      userEntity.updatePhoneNumber(' +919876543210');
      expect(userEntity.getPhoneNumber()).toBe('+919876543210');
    });
  });

  describe('UpdateNotificationStatus', () => {
    it('should disable Notification status', () => {
      userEntity.updateNotificationStatus(false);
      expect(userEntity.getNotification()).toBe(false);
    });

    it('should enable Notification status', () => {
      userEntity.updateNotificationStatus(true);
      expect(userEntity.getNotification()).toBe(true);
    });

    it('should disable Notification status when nothing was provided', () => {
      userEntity.updateNotificationStatus();
      expect(userEntity.getNotification()).toBe(false);
    });
  });

  describe('UpdateLanguagePreference', () => {
    it('should update language preference', () => {
      userEntity.updateLanguagePreference('en');
      expect(userEntity.getLanguagePreference()).toBe('en');
    });

    it('should throw InvalidLanguaugePreferenceException on invalid language', () => {
      expect(() => userEntity.updateLanguagePreference('invalid-language')).toThrow(
        InvalidLanguaugePreferenceException,
      );
    });

    it('should throw InvalidLanguaugePreferenceException on empty language', () => {
      expect(() => userEntity.updateLanguagePreference(' ')).toThrow(
        InvalidLanguaugePreferenceException,
      );
      expect(() => userEntity.updateLanguagePreference('  ')).toThrow(
        InvalidLanguaugePreferenceException,
      );
    });
  });

  describe('UpdateUserRegion', () => {
    it('should update user region', () => {
      userEntity.updateRegion('IN');
      expect(userEntity.getRegion()).toBe('IN');
    });

    it('should set IN as user region when no region was provided', () => {
      userEntity.updateRegion();
      expect(userEntity.getRegion()).toBe('IN');
    });
  });
});
