import { InvalidUserIdException } from '@views/domain/exceptions';
import { uuid } from 'zod';

export class UserId {
  private static UserIdValidationSchema = uuid();

  public constructor(private value: string) {}

  public static create(value: string) {
    const parsedUserId = UserId.UserIdValidationSchema.safeParse(value);
    if (!parsedUserId.success) {
      const errorMessage = parsedUserId.error.message;
      throw new InvalidUserIdException({
        message: `UserId validation has failed: ${errorMessage}`,
      });
    }
    return new UserId(parsedUserId.data);
  }

  public getValue(): string {
    return this.value;
  }
}
