import { Module } from '@nestjs/common';

import { UsersEventsService } from './users-events.service';
import { VideoEventsService } from './video-events.service';
import { ChannelEventsService } from './channel-events.service';
import { EventsListenerService } from './events-listener.service';

@Module({
  providers: [EventsListenerService, UsersEventsService, ChannelEventsService, VideoEventsService],
})
export class EventsModule {}
