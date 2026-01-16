import { GetChannelFromUserIdDto } from '@app/contracts/read';

export class GetChannelFromUserIdQuery {
  constructor(public readonly getChannelFromUserIdDto: GetChannelFromUserIdDto) {}
}
