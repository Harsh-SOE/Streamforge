import { IntegrationEvent } from '@app/common/events';
// TODO fix this integration event payload...

export interface ProjectionBufferPort {
  bufferUser(event: IntegrationEvent<any>): Promise<void>;

  bufferVideo(event: IntegrationEvent<any>): Promise<void>;
}

export const PROJECTION_BUFFER_PORT = Symbol('PROJECTION_BUFFER_PORT');
