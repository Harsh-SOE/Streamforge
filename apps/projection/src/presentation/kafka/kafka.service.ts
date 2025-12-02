import { EventBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { VideoUploadedEventDto } from '@app/contracts/videos';

import { VideoUploadedProjectionEvent } from '@projection/application/events';

@Injectable()
export class KafkaService {
  constructor(private readonly eventBus: EventBus) {}

  public onVideoUploadedProjectionEvent(message: VideoUploadedEventDto) {
    this.eventBus.publish<VideoUploadedProjectionEvent>(
      new VideoUploadedProjectionEvent(message),
    );
  }
}
