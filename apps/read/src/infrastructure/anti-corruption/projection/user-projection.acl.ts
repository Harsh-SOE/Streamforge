import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ProfileUpdatedIntegrationEvent } from '@app/common/events/users';

import { UserReadMongooseModel } from '@read/infrastructure/repository/models';
import { UserOnBoardedProjection } from '@read/application/payload/projection';

@Injectable()
export class UserProjectionACL {
  public constructor(
    @InjectModel(UserReadMongooseModel.name)
    private readonly userProjectionModel: Model<UserReadMongooseModel>,
  ) {}

  public userProfileCreatedEventToProjectionModel(
    payload: UserOnBoardedProjection,
  ): UserReadMongooseModel {
    const { authId, userId, email, handle, avatar } = payload;
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
