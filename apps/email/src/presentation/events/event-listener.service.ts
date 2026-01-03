import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { IntegrationEvent, USERS_EVENTS } from '@app/common/events';
import { EVENT_CONSUMER_PORT, EventsConsumerPort } from '@app/common/ports/events';

import { EventsService } from './events.service';
import { UserOnboardedEvent } from '@app/contracts/users';

@Injectable()
export class EventsListener implements OnModuleInit {
  public constructor(
    @Inject(EVENT_CONSUMER_PORT)
    private readonly eventConsumer: EventsConsumerPort,
    private readonly eventsService: EventsService,
  ) {}

  public async onModuleInit() {
    await this.eventConsumer.consumeMessage(async (event: IntegrationEvent<any>) => {
      // react to all relevant messages here...
      console.log(`Recieved event`, event);

      switch (event.eventName) {
        case USERS_EVENTS.USER_ONBOARDED_EVENT.toString(): {
          await this.eventsService.sendEMail((event as UserOnboardedEvent).payload.email);
          break;
        }
      }
    });
  }
}
