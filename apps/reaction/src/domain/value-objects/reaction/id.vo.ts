import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { InvalidIdException } from '@reaction/domain/exceptions';

export class ReactionId {
  private static ReactionIdValidationSchema = z.uuid();

  public constructor(private readonly value: string) {}

  public static create(value?: string): ReactionId {
    if (!value) {
      return new ReactionId(uuidv4());
    }

    const parsedReactionId = this.ReactionIdValidationSchema.safeParse(value);
    if (!parsedReactionId.success) {
      throw new InvalidIdException({
        message: `An error occured while validating the id: ${value}`,
        meta: parsedReactionId.error,
      });
    }
    return new ReactionId(parsedReactionId.data);
  }

  public getValue(): string {
    return this.value;
  }
}
