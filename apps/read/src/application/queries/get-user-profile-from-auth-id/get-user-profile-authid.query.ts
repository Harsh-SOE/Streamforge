import { GetUserProfileFromAuthIdDto } from '@app/contracts/read';

export class GetUserProfileFromAuthIdQuery {
  constructor(public readonly getUserProfileFromAuthIdDto: GetUserProfileFromAuthIdDto) {}
}
