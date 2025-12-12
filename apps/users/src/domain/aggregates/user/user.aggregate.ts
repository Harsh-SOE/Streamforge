import { AggregateRoot } from '@nestjs/cqrs';

import { UserEntity } from '@users/domain/entities';
import {
  ChangeLanguageEvent,
  ChangeNotificationStatusEvent,
  ChangeThemeEvent,
  CreateProfileEvent,
  PhoneNumberVerfiedEvent,
  UpdateProfileEvent,
} from '@users/application/events';

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

    userAggregate.apply(new CreateProfileEvent(userAggregate));

    return userAggregate;
  }

  public updateUserProfile(dob?: Date, phoneNumber?: string, avatar?: string) {
    if (dob) this.getUserEntity().updateDOB(new Date(dob));
    if (phoneNumber) this.getUserEntity().updatePhoneNumber(phoneNumber);
    if (avatar) this.getUserEntity().updateAvatar(avatar);

    this.apply(
      new UpdateProfileEvent({
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
      new PhoneNumberVerfiedEvent({
        id: this.getUserSnapshot().id,
        phoneNumber: this.getUserSnapshot().phoneNumber as string,
      }),
    );
  }

  public changeUserPreferredTheme(newTheme: string) {
    this.getUserEntity().updateThemePreference(newTheme);

    // event for theme changed here...
    this.apply(
      new ChangeThemeEvent({
        id: this.getUserSnapshot().id,
        theme: this.getUserSnapshot().themePreference,
      }),
    );
  }

  public changeUserPreferredlanguage(newLanguage: string) {
    this.getUserEntity().updateLanguagePreference(newLanguage);

    this.apply(
      new ChangeLanguageEvent({
        id: this.getUserSnapshot().id,
        langauge: this.getUserEntity().getLanguagePreference(),
      }),
    );
  }

  public changeUserNotificationPreference(newNotificationStatus: boolean) {
    this.getUserEntity().updateNotificationStatus(newNotificationStatus);

    this.apply(
      new ChangeNotificationStatusEvent({
        id: this.getUserSnapshot().id,
        status: this.getUserSnapshot().notification,
      }),
    );
  }
}
