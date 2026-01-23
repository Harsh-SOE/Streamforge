export interface VideoBufferMessagePayload {
  id: string;
  ownerId: string;
  channelId: string;
  title: string;
  description?: string;
  videoFileIdentifier: string;
  videoThumbnailIdentifier: string;
  videoCategories: string[];
  publishStatus: string;
  visibilityStatus: string;
}
