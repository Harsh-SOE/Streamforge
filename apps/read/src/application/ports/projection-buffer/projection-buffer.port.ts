import {
  UserOnBoardedProjection,
  VideoPublishedProjection,
} from '@read/application/payload/projection';

export interface ProjectionBufferPort {
  bufferUserOnBoardedProjection(event: UserOnBoardedProjection): Promise<void>;
  bufferVideoPublishedProjection(event: VideoPublishedProjection): Promise<void>;
}

export const PROJECTION_BUFFER_PORT = Symbol('PROJECTION_BUFFER_PORT');
