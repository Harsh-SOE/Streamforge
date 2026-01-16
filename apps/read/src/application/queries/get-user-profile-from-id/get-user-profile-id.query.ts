import { GetUserProfileFromIdDto } from '@app/contracts/read';

export class GetUserProfileFromIdQuery {
  constructor(public readonly getUserProfileDto: GetUserProfileFromIdDto) {}
}
