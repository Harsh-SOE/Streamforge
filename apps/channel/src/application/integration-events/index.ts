export * from './channel-created-inegration-event/channel-created.integration-event';
export * from './channel-monitized-integration-event/channel-monitized.integration-event';
export * from './channel-updated-integration-event/channel-updated.integration-event';

import { ChannelCreatedEventHandler } from './channel-created-inegration-event/channel-created.handler';
import { ChannelMonitizedEventHandler } from './channel-monitized-integration-event/channel-monitized.handler';
import { ChannelUpdatedEventHandler } from './channel-updated-integration-event/channel-updated.handler';

export const ChannelEventHandler = [
  ChannelCreatedEventHandler,
  ChannelMonitizedEventHandler,
  ChannelUpdatedEventHandler,
];
