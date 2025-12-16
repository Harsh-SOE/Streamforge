import { ChannelCreatedEventHandler } from './channel-created-event/channel-created.handler';
import { ChannelMonitizedEventHandler } from './channel-monitized-event/channel-monitized.handler';
import { ChannelUpdatedEventHandler } from './channel-updated-event/hub-updated.handler';

export const ChannelEventHandler = [
  ChannelCreatedEventHandler,
  ChannelMonitizedEventHandler,
  ChannelUpdatedEventHandler,
];
