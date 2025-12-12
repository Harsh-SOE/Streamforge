import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserPreferredThemeChangedResponse } from '@app/contracts/users';

import {
  USER_COMMAND_REROSITORY_PORT,
  UserRepositoryPort,
} from '@users/application/ports';
import { UserNotFoundException } from '@users/application/exceptions';
import { GrpcToDomainThemeEnumMapper } from '@users/infrastructure/anti-corruption';

import { ChangeThemeCommand } from './change-theme.command';

@CommandHandler(ChangeThemeCommand)
export class ChangeThemeCommandHandler implements ICommandHandler<ChangeThemeCommand> {
  constructor(
    @Inject(USER_COMMAND_REROSITORY_PORT)
    private readonly userRepository: UserRepositoryPort,
  ) {}

  async execute({
    userChangePreferredThemeDto,
  }: ChangeThemeCommand): Promise<UserPreferredThemeChangedResponse> {
    const { id, themePerference } = userChangePreferredThemeDto;

    const foundUserAggregate = await this.userRepository.findOneUserById(id);

    if (!foundUserAggregate) {
      throw new UserNotFoundException({
        message: `User with id:${id} was not found in the database`,
      });
    }

    const domainThemePreference =
      GrpcToDomainThemeEnumMapper.get(themePerference);

    if (!domainThemePreference) {
      throw new Error(`Invalid option for theme`);
    }

    foundUserAggregate.changeUserPreferredTheme(domainThemePreference);

    await this.userRepository.updateOneUserById(id, foundUserAggregate);

    return {
      response: 'Theme was changed successfully',
      theme: foundUserAggregate.getUserSnapshot().themePreference,
    };
  }
}
