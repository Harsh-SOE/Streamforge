import { uuid } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { InvalidIdException } from '@comments/domain/exceptions';

export class CommentId {
  private static CommentIdValidationSchema = uuid();

  public constructor(private value: string) {}

  public static create(value?: string) {
    if (!value) {
      return new CommentId(uuidv4());
    }

    const commentIdParsedValue = CommentId.CommentIdValidationSchema.safeParse(value);
    if (!commentIdParsedValue.success) {
      const message = commentIdParsedValue.error.message;
      throw new InvalidIdException({
        message: `Comment id has failed validation. Reason: ${message}`,
      });
    }
    return new CommentId(commentIdParsedValue.data);
  }

  public getValue(): string {
    return this.value;
  }
}
