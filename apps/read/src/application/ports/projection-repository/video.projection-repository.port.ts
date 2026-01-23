import { VideoPublishedProjection } from '@read/application/payload/projection';

export interface VideoProjectionRepositoryPort {
  saveVideo(data: VideoPublishedProjection): Promise<boolean>;

  saveManyVideos(data: VideoPublishedProjection[]): Promise<number>;

  // todo: make an integration event for video updated and deleted events...
}

export const VIDEO_PROJECTION_REPOSITORY_PORT = Symbol('VIDEO_PROJECTION_REPOSITORY_PORT');
