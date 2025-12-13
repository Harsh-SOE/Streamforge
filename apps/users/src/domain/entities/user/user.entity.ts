import {
  UserHandle,
  UserDOB,
  UserEmail,
  UserPhoneNumber,
  UserThemePreference,
  UserLanguagePreference,
  UserRegion,
  UserAvatarUrl,
  UserId,
} from '@users/domain/value-objects';

import { CreateUserEntityOptions, UserEntityOptions, UserSnapshot } from './options';

export class UserEntity {
  private constructor(private readonly valueObjects: UserEntityOptions) {}

  public static create(data: CreateUserEntityOptions): UserEntity {
    const {
      id,
      userAuthId,
      handle,
      email,
      avatarUrl,
      dob,
      phoneNumber,
      isPhoneNumberVerified,
      notification,
      region,
      languagePreference,
      themePreference,
    } = data;

    return new UserEntity({
      id: UserId.create(id),
      handle: UserHandle.create(handle),
      userAuthId: userAuthId,
      email: UserEmail.create(email),
      avatarUrl: UserAvatarUrl.create(avatarUrl),
      dob: UserDOB.create(dob),
      phoneNumber: UserPhoneNumber.create(phoneNumber),
      isPhoneNumberVerified: isPhoneNumberVerified ?? false,
      languagePreference: UserLanguagePreference.create(languagePreference),
      notification: notification ?? false,
      region: UserRegion.create(region),
      themePreference: UserThemePreference.create(themePreference),
    });
  }

  public getId(): string {
    return this.valueObjects.id.getValue();
  }

  public getUserAuthId() {
    return this.valueObjects.userAuthId;
  }

  public getUserHandle(): string {
    return this.valueObjects.handle.getValue();
  }

  public getEmail(): string {
    return this.valueObjects.email.getValue();
  }

  public getAvatarUrl(): string {
    return this.valueObjects.avatarUrl.getValue();
  }

  public getDob(): Date | undefined {
    return this.valueObjects.dob.getValue();
  }

  public getPhoneNumber(): string | undefined {
    return this.valueObjects.phoneNumber.getValue();
  }

  public getIsPhoneNumberVerified(): boolean {
    return this.valueObjects.isPhoneNumberVerified;
  }

  public getNotification(): boolean {
    return this.valueObjects.notification;
  }

  public getThemePreference(): string {
    return this.valueObjects.themePreference.getValue();
  }

  public getLanguagePreference(): string {
    return this.valueObjects.languagePreference.getValue();
  }

  public getRegion(): string {
    return this.valueObjects.region.getValue();
  }

  public getSnapshot(): UserSnapshot {
    return {
      id: this.valueObjects.id.getValue(),
      userAuthId: this.valueObjects.userAuthId,
      handle: this.valueObjects.handle.getValue(),
      email: this.valueObjects.email.getValue(),
      avatarUrl: this.valueObjects.avatarUrl.getValue(),
      dob: this.valueObjects.dob.getValue(),
      phoneNumber: this.valueObjects.phoneNumber.getValue(),
      isPhoneNumbetVerified: this.valueObjects.isPhoneNumberVerified,
      notification: this.valueObjects.notification,
      themePreference: this.valueObjects.themePreference.getValue(),
      languagePreference: this.valueObjects.languagePreference.getValue(),
      region: this.valueObjects.region.getValue(),
    };
  }

  public updateEmail(newEmail: string): void {
    this.valueObjects.email = UserEmail.create(newEmail);
    return;
  }

  public updateAvatar(newAvatar: string): void {
    this.valueObjects.avatarUrl = UserAvatarUrl.create(newAvatar);
    return;
  }

  public updateDOB(newDOB: Date): void {
    this.valueObjects.dob = UserDOB.create(newDOB);
    return;
  }

  public updatePhoneNumber(newPhoneNumber: string): void {
    this.valueObjects.phoneNumber = UserPhoneNumber.create(newPhoneNumber);
    this.valueObjects.isPhoneNumberVerified = false;
    return;
  }

  public verifyPhoneNumber(): void {
    this.valueObjects.isPhoneNumberVerified = true;
    return;
  }

  public updateNotificationStatus(newNotificationStatus?: boolean): void {
    this.valueObjects.notification = newNotificationStatus ?? false;
    return;
  }

  public updateThemePreference(newThemePreference: string): void {
    this.valueObjects.themePreference = UserThemePreference.create(newThemePreference);
    return;
  }

  public updateLanguagePreference(newLanguagePreference: string): void {
    this.valueObjects.languagePreference = UserLanguagePreference.create(newLanguagePreference);
    return;
  }

  public updateRegion(newRegion?: string): void {
    this.valueObjects.region = UserRegion.create(newRegion);
    return;
  }
}
