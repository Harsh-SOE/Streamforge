import z from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';

import { InvalidUserIdException } from '@channel/domain/exceptions';

@Injectable()
export class ChannelId {
  private static channelIdValidationSchema = z.uuid();

  public constructor(private value: string) {}

  public static create(value?: string) {
    if (!value) {
      value = uuidv4();
    }

    const parsedChannelId = ChannelId.channelIdValidationSchema.safeParse(value);
    if (!parsedChannelId.success) {
      const errorMessage = parsedChannelId.error.message;
      throw new InvalidUserIdException({
        message: `Channel's Id validation failed. Reason: ${errorMessage}`,
      });
    }
    return new ChannelId(parsedChannelId.data);
  }

  public getValue() {
    return this.value;
  }
}
