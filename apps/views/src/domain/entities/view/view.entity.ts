import { UserId, VideoId, ViewId } from '@views/domain/value-objects';

import { ViewEntityCreateOptions, ViewEntityOptions, ViewSnapshot } from './options';

export class ViewEntity {
  private constructor(private readonly valueObjects: ViewEntityOptions) {}

  public static create(data: ViewEntityCreateOptions) {
    return new ViewEntity({
      id: ViewId.create(data.id),
      userId: UserId.create(data.userId),
      videoId: VideoId.create(data.videoId),
    });
  }

  public getId(): string {
    return this.valueObjects.id.getValue();
  }

  public getUserId(): string {
    return this.valueObjects.userId.getValue();
  }

  public getVideoId(): string {
    return this.valueObjects.videoId.getValue();
  }

  public getSnapshot(): ViewSnapshot {
    return {
      id: this.valueObjects.id.getValue(),
      userId: this.valueObjects.userId.getValue(),
      videoId: this.valueObjects.videoId.getValue(),
    };
  }
}
