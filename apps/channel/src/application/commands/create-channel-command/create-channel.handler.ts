import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';

import { ChannelCreatedResponse } from '@app/contracts/channel';

import { ChannelAggregate } from '@channel/domain/aggregates';
import { CHANNEL_REPOSITORY, ChannelCommandRepositoryPort } from '@channel/application/ports';

import { CreateChannelCommand } from './create-channel.command';

@CommandHandler(CreateChannelCommand)
export class CreateChannelCommandHandler implements ICommandHandler<CreateChannelCommand> {
  public constructor(
    @Inject(CHANNEL_REPOSITORY)
    private readonly channelCommandRepository: ChannelCommandRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({ channelCreateDto }: CreateChannelCommand): Promise<ChannelCreatedResponse> {
    const { userId, channelBio, isChannelMonitized, channelCoverImage, isChannelVerified } =
      channelCreateDto;

    const channelAggregate = this.eventPublisher.mergeObjectContext(
      ChannelAggregate.create({
        userId,
        isChannelVerified,
        isChannelMonitized,
        bio: channelBio,
        coverImage: channelCoverImage,
      }),
    );

    await this.channelCommandRepository.saveChannel(channelAggregate);

    channelAggregate.commit();

    return {
      channelId: channelAggregate.getChannelSnapshot().id,
      response: `Channel created successfully`,
    };
  }
}
