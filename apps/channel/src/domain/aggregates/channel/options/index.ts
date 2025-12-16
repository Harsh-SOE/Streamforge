export interface ChannelAggregateCreateOptions {
  readonly id?: string;
  readonly userId: string;
  bio?: string;
  coverImage?: string;
  isChannelVerified?: boolean;
  isChannelMonitized?: boolean;
}

export interface ChannelUpdateOptions {
  bio?: string;
  coverImage?: string;
}
