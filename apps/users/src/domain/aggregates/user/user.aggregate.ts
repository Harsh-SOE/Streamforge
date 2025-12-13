import { AggregateRoot } from '@nestjs/cqrs';

import { UserEntity } from '@users/domain/entities';

import { UserOnboardingEvent } from '@users/application/events/user-onboarded-event';
import { UserProfileUpdatedEvent } from '@users/application/events/user-profile-updated-event';
import { UserPhoneNumberVerifiedEvent } from '@users/application/events/user-phone-number-verified-event';
import { UserThemeChangedEvent } from '@users/application/events/user-theme-changed-event';
import { UserLanguageChangedEvent } from '@users/application/events/user-language-changed-event';
import { UserNotificationStatusChangedEvent } from '@users/application/events/user-notification-status-changed-event';

import { UserAggregateOption } from './options';

export class UserAggregate extends AggregateRoot {
  private constructor(private readonly userEntity: UserEntity) {
    super();
  }

  public getUserSnapshot() {
    return this.userEntity.getSnapshot();
  }

  private getUserEntity() {
    return this.userEntity;
  }

  public static create(data: UserAggregateOption, emitOnboardingEvent = true): UserAggregate {
    const {
      id,
      handle,
      userAuthId,
      email,
      avatarUrl,
      dob,
      isPhoneNumberVerified,
      notification,
      phoneNumber,
      preferredLanguage,
      preferredTheme,
      region,
    } = data;

    const userEntity = UserEntity.create({
      id: id,
      userAuthId: userAuthId,
      handle: handle,
      email: email,
      avatarUrl: avatarUrl,
      dob: dob,
      phoneNumber: phoneNumber,
      isPhoneNumberVerified: isPhoneNumberVerified,
      notification: notification,
      themePreference: preferredTheme,
      languagePreference: preferredLanguage,
      region: region,
    });
    const userAggregate = new UserAggregate(userEntity);

    if (emitOnboardingEvent) {
      const userEntity = userAggregate.getUserEntity();
      userAggregate.apply(
        new UserOnboardingEvent({
          id: userEntity.getId(),
          userAuthId: userEntity.getUserAuthId(),
          email: userEntity.getEmail(),
          handle: userEntity.getUserHandle(),
          avatar: userEntity.getAvatarUrl(),
          dob: userEntity.getDob()?.toISOString(),
          phoneNumber: userEntity.getPhoneNumber(),
          isPhoneNumberVerified: userEntity.getIsPhoneNumberVerified(),
        }),
      );
    }

    return userAggregate;
  }

  public updateUserProfile(
    data: {
      dob?: Date;
      phoneNumber?: string;
      avatar?: string;
    },
    emitUpdatedProfileEvent = true,
  ): boolean {
    const userEntity = this.getUserEntity();
    const { dob, avatar, phoneNumber } = data;

    if (dob) userEntity.updateDOB(new Date(dob));
    if (phoneNumber) userEntity.updatePhoneNumber(phoneNumber);
    if (avatar) userEntity.updateAvatar(avatar);

    if (emitUpdatedProfileEvent) {
      this.apply(
        new UserProfileUpdatedEvent({
          id: userEntity.getId(),
          avatar: userEntity.getAvatarUrl(),
          dob: userEntity.getDob()?.toISOString(),
          phoneNumber: userEntity.getPhoneNumber(),
        }),
      );
    }

    return true;
  }

  public verifyUserPhoneNumber(emitPhoneNumberVerifiedEvent = true): boolean {
    const userEntity = this.getUserEntity();

    if (!userEntity.getPhoneNumber()) {
      return false;
    }
    userEntity.verifyPhoneNumber();

    if (emitPhoneNumberVerifiedEvent) {
      this.apply(
        new UserPhoneNumberVerifiedEvent({
          id: userEntity.getId(),
          phoneNumber: userEntity.getPhoneNumber() as string,
        }),
      );
    }

    return true;
  }

  public changeUserPreferredTheme(newTheme: string, emitThemeChangedEvent = true): boolean {
    const userEntity = this.getUserEntity();
    userEntity.updateThemePreference(newTheme);

    if (emitThemeChangedEvent) {
      this.apply(
        new UserThemeChangedEvent({
          id: userEntity.getId(),
          theme: userEntity.getThemePreference(),
        }),
      );
    }

    return true;
  }

  public changeUserPreferredLanguage(newLanguage: string, emitLanguageEvent = true): boolean {
    const userEntity = this.getUserEntity();
    userEntity.updateLanguagePreference(newLanguage);

    if (emitLanguageEvent) {
      this.apply(
        new UserLanguageChangedEvent({
          id: userEntity.getId(),
          language: userEntity.getLanguagePreference(),
        }),
      );
    }

    return true;
  }

  public changeUserNotificationPreference(
    newNotificationStatus: boolean,
    emitNotificationEvent = true,
  ): boolean {
    const userEntity = this.getUserEntity();
    userEntity.updateNotificationStatus(newNotificationStatus);

    if (emitNotificationEvent) {
      this.apply(
        new UserNotificationStatusChangedEvent({
          id: userEntity.getId(),
          status: userEntity.getNotification(),
        }),
      );
    }

    return true;
  }
}
