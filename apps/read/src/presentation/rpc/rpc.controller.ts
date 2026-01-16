import { Observable } from 'rxjs';
import { Controller, UseFilters } from '@nestjs/common';

import {
  GetChannelFromIdDto,
  GetChannelFromUserIdDto,
  GetChannelResponse,
  GetUserProfileFromAuthIdDto,
  GetUserProfileFromIdDto,
  GetUserProfileResponse,
  ReadQueryServiceController,
  ReadQueryServiceControllerMethods,
} from '@app/contracts/read';

import { GrpcFilter } from '../filters';
import { RpcService } from './rpc.service';

@Controller()
@UseFilters(GrpcFilter)
@ReadQueryServiceControllerMethods()
export class RpcController implements ReadQueryServiceController {
  public constructor(public readonly grpcService: RpcService) {}

  getUserProfileFromId(
    getUserProfileFromIdDto: GetUserProfileFromIdDto,
  ): Promise<GetUserProfileResponse> | Observable<GetUserProfileResponse> | GetUserProfileResponse {
    return this.grpcService.getUserProfileFromIdQuery(getUserProfileFromIdDto);
  }

  getUserProfileFromAuthId(
    getUserProfileFromAuthIdDto: GetUserProfileFromAuthIdDto,
  ): Promise<GetUserProfileResponse> | Observable<GetUserProfileResponse> | GetUserProfileResponse {
    return this.grpcService.getUserProfileFromAuthIdQuery(getUserProfileFromAuthIdDto);
  }

  getChannelFromId(
    getChannelFromIdDto: GetChannelFromIdDto,
  ): Promise<GetChannelResponse> | Observable<GetChannelResponse> | GetChannelResponse {
    return this.grpcService.getChannelFromId(getChannelFromIdDto);
  }

  getChannelFromUserId(
    getChannelFromUserIdDto: GetChannelFromUserIdDto,
  ): Promise<GetChannelResponse> | Observable<GetChannelResponse> | GetChannelResponse {
    return this.grpcService.getChannelFromUserId(getChannelFromUserIdDto);
  }
}
