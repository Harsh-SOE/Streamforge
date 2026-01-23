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

  /*
  public videoUpdatedEventToPersistance(
    event: VideoUpatedEventDto,
  ): Partial<VideoWatchProjectionModel> {
    const videoCard = {
      videoId: event.videoId,
      title: event.title,
      thumbnailUrl: event.thumbnailUrl,
      videoUrl: event.videoUrl,
      categories: event.categories,
      views: event.views,
      commentsCount: event.commentsCount,
      durationSeconds: event.durationSeconds,
      likes: event.likes,
      visibility: event.visibility,
    };

    return new this.videoCard(videoCard);
  }
  */
}
