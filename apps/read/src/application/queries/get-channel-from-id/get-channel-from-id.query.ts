import { GetChannelFromIdDto } from '@app/contracts/read';

export class GetChannelFromIdQuery {
  constructor(public readonly getChannelFromIdDto: GetChannelFromIdDto) {}
}
