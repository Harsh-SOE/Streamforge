import { VideoCreatedEventHandler } from './video-created.handler';
import { VideoTranscodedEventHandler } from './video-transcoded.handler';

export const VideoEventHandler = [VideoCreatedEventHandler, VideoTranscodedEventHandler];
