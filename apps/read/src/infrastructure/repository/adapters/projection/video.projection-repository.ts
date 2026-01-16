import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { VideoPublishedIntegrationEvent } from '@app/common/events/videos';

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

  public async saveVideo(data: VideoPublishedIntegrationEvent): Promise<boolean> {
    await this.videoProjectionModel.create(
      this.videoProjectionACL.videoUploadedEventToProjectionModel(data),
    );

    return true;
  }

  async saveManyVideos(event: VideoPublishedIntegrationEvent[]): Promise<number> {
    const data = event.map((data) =>
      this.videoProjectionACL.videoUploadedEventToProjectionModel(data),
    );
    const savedCards = await this.videoProjectionModel.insertMany(data);

    return savedCards.length;
  }

  /*
  public async updateVideo(videoId: string, event: VideoUploadedEventDto): Promise<boolean> {
    const updated = await this.projectedVideoCard.findOneAndUpdate(
      { videoId },
      { $set: this.videoCardACL.videoUpdatedEventToPersistance(event) },
      { new: true },
    );

    return updated ? true : false;
  }

  public async deleteVideo(videoId: string): Promise<boolean> {
    const result = await this.projectedVideoCard.deleteOne({ videoId });
    return result.acknowledged;
  }
  */
}
