import { ActivateMonitizationCommandHandler } from './activate-monitization-command/activate-monitization.handler';
import { CreateChannelCommandHandler } from './create-channel-command/create-channel.handler';
import { UpdateChannelCommandHandler } from './update-channel-command/update-channel.handler';
import { VerifyChannelHandler } from './verify-channel-command/verify-channel.handler';
import { GeneratePreSignedUrlHandler } from './generate-presigned-url-command/generate-presigned-url.handler';

export const ChannelCommandHandlers = [
  ActivateMonitizationCommandHandler,
  CreateChannelCommandHandler,
  UpdateChannelCommandHandler,
  VerifyChannelHandler,
  GeneratePreSignedUrlHandler,
];
