import { VideoUploadedEventDto } from '@app/contracts/videos';

export interface ProjectionRepositoryPort {
  saveVideo(data: VideoUploadedEventDto): Promise<boolean>;

  saveManyVideos(data: VideoUploadedEventDto[]): Promise<number>;

  updateVideo(
    videoId: string,
    data: Partial<VideoUploadedEventDto>,
  ): Promise<boolean>;

  deleteVideo(videoId: string): Promise<boolean>;
}

export const PROJECTION_REPOSITORY_PORT = Symbol('PROJECTION_REPOSITORY_PORT');
