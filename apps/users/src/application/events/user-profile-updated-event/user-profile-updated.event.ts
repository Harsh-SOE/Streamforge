import { UserUpdateProfileDto } from '@app/contracts/users';

export class UserProfileUpdatedEvent {
  public constructor(
    public readonly userUpdateProfileDto: {
      updatedProfile: UserUpdateProfileDto;
    },
  ) {}
}
