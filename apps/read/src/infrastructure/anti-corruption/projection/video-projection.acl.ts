import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { VideoPublishedProjection } from '@read/application/payload/projection';
import { VideoWatchReadMongooseModel } from '@read/infrastructure/repository/models';

@Injectable()
export class VideoProjectionACL {
  public constructor(
    @InjectModel(VideoWatchReadMongooseModel.name)
    private readonly videoProjectionModel: Model<VideoWatchReadMongooseModel>,
  ) {}

  public videoUploadedEventToProjectionModel(
    payload: VideoPublishedProjection,
  ): VideoWatchReadMongooseModel {
    const {
      videoId,
      userId,
      channelId,
      title,
      fileIdentifier,
      thumbnailIdentifier,
      categories,
      visibility,
      description,
    } = payload;

    const videoCard = {
      videoId,
      userId,
      channelId,
      title,
      thumbnailUrl: thumbnailIdentifier,
      videoUrl: fileIdentifier,
      durationSeconds: 500,
      publishedAt: new Date(),
      categories,
      visibility,
      description,
    };

    return new this.videoProjectionModel(videoCard);
  }
}
