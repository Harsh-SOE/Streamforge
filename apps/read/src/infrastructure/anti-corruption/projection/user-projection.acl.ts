import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  OnboardedIntegrationEvent,
  ProfileUpdatedIntegrationEvent,
} from '@app/common/events/users';

import { UserReadMongooseModel } from '@read/infrastructure/repository/models';

@Injectable()
export class UserProjectionACL {
  public constructor(
    @InjectModel(UserReadMongooseModel.name)
    private readonly userProjectionModel: Model<UserReadMongooseModel>,
  ) {}

  public userProfileCreatedEventToProjectionModel(
    event: OnboardedIntegrationEvent,
  ): UserReadMongooseModel {
    const { authId, userId, email, handle, avatar } = event.payload;
    const userCard = {
      userId,
      email,
      handle,
      userAuthId: authId,
      avatar,
    };

    return new this.userProjectionModel(userCard);
  }

  public userProfileUpdatedEventToProjectionModel(
    event: ProfileUpdatedIntegrationEvent,
  ): UserReadMongooseModel {
    const { userId, avatar, dob } = event.payload;

    const userCard = {
      userId,
      avatar,
      dob,
    };

    return new this.userProjectionModel(userCard);
  }
}
