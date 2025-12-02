import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';

import {
  PROJECTION_REPOSITORY_PORT,
  ProjectionRepositoryPort,
} from '@projection/application/ports';

import { VideoUploadedProjectionEvent } from './video-uploaded.event';

@EventsHandler(VideoUploadedProjectionEvent)
export class VideoUploadedProjectionHandler implements IEventHandler<VideoUploadedProjectionEvent> {
  constructor(
    @Inject(PROJECTION_REPOSITORY_PORT)
    private readonly videoCardRepository: ProjectionRepositoryPort,
  ) {}

  async handle({ videoUploadedEvent }: VideoUploadedProjectionEvent) {
    await this.videoCardRepository.saveVideo(videoUploadedEvent);
  }
}
