import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { VideoPublishedProjection } from '@read/application/payload/projection';

import { VideoProjectionRepositoryPort } from '@read/application/ports';
import { VideoProjectionACL } from '@read/infrastructure/anti-corruption';
import { VideoWatchReadMongooseModel } from '@read/infrastructure/repository/models';

@Injectable()
export class VideoProjectionRepository implements VideoProjectionRepositoryPort {
  constructor(
    @InjectModel(VideoWatchReadMongooseModel.name)
    private readonly videoProjectionModel: Model<VideoWatchReadMongooseModel>,
    private readonly videoProjectionACL: VideoProjectionACL,
  ) {}

  public async saveVideo(data: VideoPublishedProjection): Promise<boolean> {
    await this.videoProjectionModel.create(
      this.videoProjectionACL.videoUploadedEventToProjectionModel(data),
    );

    return true;
  }

  async saveManyVideos(event: VideoPublishedProjection[]): Promise<number> {
    const data = event.map((data) =>
      this.videoProjectionACL.videoUploadedEventToProjectionModel(data),
    );
    const savedCards = await this.videoProjectionModel.insertMany(data);

    return savedCards.length;
  }
}
