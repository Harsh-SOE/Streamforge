import { VideoUploadedEventDto } from '@app/contracts/videos';

export interface ProjectionBufferPort {
  bufferVideoCards(event: VideoUploadedEventDto): Promise<void>;

  processVideoCards(): Promise<number | void>;
}

export const PROJECTION_BUFFER_PORT = Symbol('PROJECTION_BUFFER_PORT');
