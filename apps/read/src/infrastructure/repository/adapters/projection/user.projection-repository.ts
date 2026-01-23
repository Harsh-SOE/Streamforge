import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ProfileUpdatedIntegrationEvent } from '@app/common/events/users';

import { UserProjectionRepositoryPort } from '@read/application/ports';
import { UserProjectionACL } from '@read/infrastructure/anti-corruption';
import { UserReadMongooseModel } from '@read/infrastructure/repository/models';
import { UserOnBoardedProjection } from '@read/application/payload/projection';

@Injectable()
export class UserProjectionRepository implements UserProjectionRepositoryPort {
  constructor(
    @InjectModel(UserReadMongooseModel.name)
    private readonly userReadModel: Model<UserReadMongooseModel>,
    private readonly userProjectionACL: UserProjectionACL,
  ) {}

  public async saveUser(event: UserOnBoardedProjection): Promise<boolean> {
    await this.userReadModel.create(
      this.userProjectionACL.userProfileCreatedEventToProjectionModel(event),
    );

    return true;
  }

  async saveManyUser(event: UserOnBoardedProjection[]): Promise<number> {
    const data = event.map((data) =>
      this.userProjectionACL.userProfileCreatedEventToProjectionModel(data),
    );
    const savedCards = await this.userReadModel.insertMany(data);

    return savedCards.length;
  }

  public async updateUser(
    videoId: string,
    event: ProfileUpdatedIntegrationEvent,
  ): Promise<boolean> {
    const updated = await this.userReadModel.findOneAndUpdate(
      { videoId },
      { $set: this.userProjectionACL.userProfileUpdatedEventToProjectionModel(event) },
      { new: true },
    );

    return updated ? true : false;
  }

  public async deleteUser(videoId: string): Promise<boolean> {
    const result = await this.userReadModel.deleteOne({ videoId });
    return result.acknowledged;
  }
}
