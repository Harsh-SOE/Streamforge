import { z } from 'zod';

import { InvalidVideoIdException } from '@views/domain/exceptions';

export class VideoId {
  private static VideoIdValidationSchema = z.uuid();

  public constructor(private value: string) {}

  public static create(value: string): VideoId {
    const parsedVideoId = this.VideoIdValidationSchema.safeParse(value);
    if (!parsedVideoId.success) {
      const errorMessage = parsedVideoId.error.message;
      throw new InvalidVideoIdException({
        message: `VideoId validation has failed: ${errorMessage}`,
      });
    }
    return new VideoId(parsedVideoId.data);
  }

  public getValue(): string {
    return this.value;
  }
}
