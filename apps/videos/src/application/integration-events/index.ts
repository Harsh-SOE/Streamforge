import { VideoCreatedEventHandler } from './video-created-integration-event/video-created.handler';
import { VideoTranscodedEventHandler } from './video-transcoded-integration-event/video-transcoded.handler';

export const VideoEventHandler = [VideoCreatedEventHandler, VideoTranscodedEventHandler];
