import { UserPhoneNumberEventDto } from '@app/contracts/users';

export class UserPhoneNumberVerifiedEvent {
  public constructor(public readonly userPhoneNumberEventDto: UserPhoneNumberEventDto) {}
}
