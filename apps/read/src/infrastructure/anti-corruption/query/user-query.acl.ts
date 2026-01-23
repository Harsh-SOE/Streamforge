import { Injectable } from '@nestjs/common';

import { UserQuery } from '@read/application/payload/query';
import { UserReadMongooseModel } from '@read/infrastructure/repository/models';

@Injectable()
export class UserQueryACL {
  public userProjectionSchemaToQueryModel(projectionModel: UserReadMongooseModel): UserQuery {
    return {
      userId: projectionModel.userId,
      userAuthId: projectionModel.userAuthId,
      email: projectionModel.email,
      handle: projectionModel.handle,
      avatar: projectionModel.avatar,
      dob: projectionModel.dob,
      phoneNumber: projectionModel.phoneNumber,
      isPhoneNumberVerified: projectionModel.isPhoneNumberVerified,
    };
  }
}
