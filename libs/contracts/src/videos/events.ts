// export interface VideoPublishedEvent {
//   eventId: string;
//   occurredAt: string;
//   videoId: string;
//   ownerId: string;
//   channelId: string;
//   title: string;
//   description?: string;
//   videoUrl: string;
//   thumbnailUrl: string;
//   durationSeconds: number;
//   categories: string[];
//   visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
//   publishedAt: string;
// }

export interface VideoUploadedEventDto {
  ownerId: string;
  ownerAvatar: string;
  ownerHandle: string;

  channelId: string;

  videoId: string;
  title: string;
  searchTitle?: string;
  thumbnailUrl: string;
  videoUrl: string;
  durationSeconds: number;
  visibility: string;
  categories: string[];

  views: number;
  likes: number;
  commentsCount: number;

  publishedAt: Date;
  updatedAt: Date;
}

export interface VideoUpatedEventDto {
  videoId: string;
  title?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  durationSeconds?: number;
  visibility?: string;
  categories?: string[];

  views?: number;
  likes?: number;
  commentsCount?: number;

  updatedAt?: Date;
}
