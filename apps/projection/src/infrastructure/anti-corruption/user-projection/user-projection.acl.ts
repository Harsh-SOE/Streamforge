import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { UserProfileCreatedEventDto, UserProfileUpdatedEventDto } from '@app/contracts/users';

import { UserProjectionModel } from '@projection/infrastructure/repository/models';

@Injectable()
export class UserProjectionACL {
  public constructor(
    @InjectModel(UserProjectionModel.name)
    private readonly userCard: Model<UserProjectionModel>,
  ) {}

  public userProfileCreatedEventToPersistance(
    event: UserProfileCreatedEventDto,
  ): UserProjectionModel {
    const userCard = {
      userId: event.id,
      userAuthId: event.userAuthId,
      email: event.email,
      handle: event.handle,
      avatar: event.avatar,
      dob: event.dob,
      phoneNumber: event.phoneNumber,
      isPhoneNumberVerified: event.isPhoneNumberVerified || false,
    };

    return new this.userCard(userCard);
  }

  public userProfileUpdatedEventToPersistance(
    event: UserProfileUpdatedEventDto,
  ): UserProjectionModel {
    const userCard = {
      userId: event.id,
      avatar: event.avatar,
      dob: event.dob,
    };

    return new this.userCard(userCard);
  }
}
