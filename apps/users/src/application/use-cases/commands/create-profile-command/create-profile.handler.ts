import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';

import {
  USER_REROSITORY_PORT,
  UserRepositoryPort,
} from '@users/application/ports';
import { UserAggregate } from '@users/domain/aggregates';

import { UserProfileCreatedResponse } from '@app/contracts/users';

import { CreateProfileCommand } from './create-profile.command';

@CommandHandler(CreateProfileCommand)
export class CompleteSignupCommandHandler implements ICommandHandler<CreateProfileCommand> {
  constructor(
    @Inject(USER_REROSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute({
    userCreateProfileDto,
  }: CreateProfileCommand): Promise<UserProfileCreatedResponse> {
    const { authId, email, handle, avatar } = userCreateProfileDto;

    const id = uuidv4();

    const userAggregate = this.eventPublisher.mergeObjectContext(
      UserAggregate.create({
        id: id,
        userAuthId: authId,
        handle: handle,
        email: email,
        avatarUrl: avatar,
      }),
    );

    await this.userRepository.saveOneUser(userAggregate);

    userAggregate.commit();

    return {
      response: 'User signup successful',
      userId: userAggregate.getUserSnapshot().id,
    };
  }
}
