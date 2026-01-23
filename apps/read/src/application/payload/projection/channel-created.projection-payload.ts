export interface ChannelCreatedProjection {
  channelId: string;
  userId: string;
  isChannelMonitized: boolean;
  isChannelVerified: boolean;
  coverImage?: string;
  bio?: string;
}
