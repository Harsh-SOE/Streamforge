import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { VideoUploadedEventDto } from '@app/contracts/videos';
import { ChannelCreatedEventDto } from '@app/contracts/channel';
import { LOGGER_PORT, LoggerPort } from '@app/common/ports/logger';
import { CHANNEL_EVENTS, USERS_EVENTS, VIDEO_EVENTS } from '@app/common/events';
import { EVENT_CONSUMER_PORT, EventsConsumerPort } from '@app/common/ports/events';
import { UserProfileCreatedEventDto, UserProfileUpdatedEventDto } from '@app/contracts/users';

import { UsersEventsService } from './users-events.service';
import { VideoEventsService } from './video-events.service';
import { ChannelEventsService } from './channel-events.service';

@Injectable()
export class EventsListenerService implements OnModuleInit {
  constructor(
    @Inject(EVENT_CONSUMER_PORT) private readonly eventConsumer: EventsConsumerPort,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly usersEventService: UsersEventsService,
    private readonly channelEventsService: ChannelEventsService,
    private readonly videoEventsService: VideoEventsService,
  ) {}

  public async onModuleInit() {
    await this.eventConsumer.consumeMessage(async (event) => {
      this.logger.info(`projection event recieved`, event);
      switch (event.eventName) {
        case USERS_EVENTS.USER_ONBOARDED_EVENT.toString(): {
          await this.usersEventService.onUserProfileOnBoarded(
            event.payload as UserProfileCreatedEventDto,
          );
          break;
        }
        case USERS_EVENTS.USER_PROFILE_UPDATED_EVENT.toString(): {
          await this.usersEventService.onUserProfileUpdated(
            event.payload as UserProfileUpdatedEventDto,
          );
          break;
        }
        case CHANNEL_EVENTS.CHANNEL_CREATED.toString(): {
          await this.channelEventsService.onChannelCreated(event.payload as ChannelCreatedEventDto);
          break;
        }
        case VIDEO_EVENTS.VIDEO_UPLOADED_EVENT.toString(): {
          await this.videoEventsService.onVideoUploaded(event.payload as VideoUploadedEventDto);
          break;
        }
      }
    });
  }
}
