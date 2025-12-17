import { VideoUploadedEventDto } from '@app/contracts/videos';
import { UserProfileCreatedEventDto } from '@app/contracts/users';

export interface ProjectionBufferPort {
  bufferUser(event: UserProfileCreatedEventDto): Promise<void>;

  processUser(): Promise<number | void>;

  bufferVideo(event: VideoUploadedEventDto): Promise<void>;

  processVideos(): Promise<number | void>;
}

export const PROJECTION_BUFFER_PORT = Symbol('PROJECTION_BUFFER_PORT');
