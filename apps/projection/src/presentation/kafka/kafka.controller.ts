import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

import { VIDEO_EVENTS } from '@app/clients';

import { KafkaService } from './kafka.service';
import { VideoUploadedEventDto } from '@app/contracts/videos';

@Controller('projection')
export class KafkaController {
  public constructor(private readonly kafkaService: KafkaService) {}

  @EventPattern(VIDEO_EVENTS.VIDEO_PUBLISHED_EVENT)
  public onVideoUploadedProjectionEvent(
    @Payload() message: VideoUploadedEventDto,
  ) {
    this.kafkaService.onVideoUploadedProjectionEvent(message);
  }
}
