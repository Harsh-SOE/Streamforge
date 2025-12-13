import { AggregateRoot } from '@nestjs/cqrs';

import { UserEntity } from '@users/domain/entities';
import { UserLanguageChangedEvent } from '@users/application/events/user-language-changed-event';
import { UserNotificationStatusChangedEvent } from '@users/application/events/user-notification-status-changed-event';
import { UserOnboardingEvent } from '@users/application/events/user-onboarded-event';
import { UserPhoneNumberVerfiedEvent } from '@users/application/events/user-phone-number-verified-event';
import { UserProfileUpdatedEvent } from '@users/application/events/user-profile-updated-event';
import { UserThemeChangedEvent } from '@users/application/events/user-theme-changed-event';

export interface userAggregateOption {
  id?: string;
  userAuthId: string;
  handle: string;
  email: string;
  avatarUrl: string;
  dob?: Date;
  phoneNumber?: string;
  isPhoneNumberVerified?: boolean;
  notification?: boolean;
  preferredTheme?: string;
  preferredLanguage?: string;
  region?: string;
}

export class UserAggregate extends AggregateRoot {
  public constructor(private userEntity: UserEntity) {
    super();
  }

  public getUserSnapshot() {
    return this.userEntity.getSnapshot();
  }

  private getUserEntity() {
    return this.userEntity;
  }

  public static create(data: userAggregateOption): UserAggregate {
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

    userAggregate.apply(new UserOnboardingEvent(userAggregate));

    return userAggregate;
  }

  public updateUserProfile(dob?: Date, phoneNumber?: string, avatar?: string) {
    if (dob) this.getUserEntity().updateDOB(new Date(dob));
    if (phoneNumber) this.getUserEntity().updatePhoneNumber(phoneNumber);
    if (avatar) this.getUserEntity().updateAvatar(avatar);

    this.apply(
      new UserProfileUpdatedEvent({
        updatedProfile: {
          id: this.getUserSnapshot().id,
          dob: dob?.toISOString(),
          phoneNumber,
        },
      }),
    );
  }

  public verifyUserPhoneNumber() {
    if (!this.getUserEntity().getPhoneNumber()) {
      return;
    }
    this.getUserEntity().verifyPhoneNumber();

    this.apply(
      new UserPhoneNumberVerfiedEvent({
        id: this.getUserSnapshot().id,
        phoneNumber: this.getUserSnapshot().phoneNumber as string,
      }),
    );
  }

  public changeUserPreferredTheme(newTheme: string) {
    this.getUserEntity().updateThemePreference(newTheme);

    // event for theme changed here...
    this.apply(
      new UserThemeChangedEvent({
        id: this.getUserSnapshot().id,
        theme: this.getUserSnapshot().themePreference,
      }),
    );
  }

  public changeUserPreferredlanguage(newLanguage: string) {
    this.getUserEntity().updateLanguagePreference(newLanguage);

    this.apply(
      new UserLanguageChangedEvent({
        id: this.getUserSnapshot().id,
        langauge: this.getUserEntity().getLanguagePreference(),
      }),
    );
  }

  public changeUserNotificationPreference(newNotificationStatus: boolean) {
    this.getUserEntity().updateNotificationStatus(newNotificationStatus);

    this.apply(
      new UserNotificationStatusChangedEvent({
        id: this.getUserSnapshot().id,
        status: this.getUserSnapshot().notification,
      }),
    );
  }
}
