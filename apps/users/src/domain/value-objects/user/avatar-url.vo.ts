import { z } from 'zod';

import { InvalidAvatarUrlException } from '@users/domain/exceptions';

export class UserAvatarUrl {
  private static UserAvatarUrlValidationSchema = z.url();

  public constructor(private readonly value: string) {}

  public static create(value: string) {
    value = value.trim();

    const parsedUrlResult = UserAvatarUrl.UserAvatarUrlValidationSchema.safeParse(value);
    if (!parsedUrlResult.success) {
      const errorMessage = parsedUrlResult.error.message;
      throw new InvalidAvatarUrlException({
        message: `Handle validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserAvatarUrl(parsedUrlResult.data);
  }

  public getValue() {
    return this.value;
  }
}
