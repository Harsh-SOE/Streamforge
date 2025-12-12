import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { InvalidPhoneNumberException } from '@users/domain/exceptions';

export class UserPhoneNumber {
  private static UserPhoneNumberValidationSchema = z
    .string()
    .refine(
      (val) => {
        const phoneNumber = parsePhoneNumberFromString(val);
        return phoneNumber?.isValid() ?? false;
      },
      { error: 'Invalid phone number' },
    )
    .optional();

  public constructor(private readonly value?: string) {}

  public static create(value?: string) {
    value = value?.trim();
    const parsedDateResult =
      UserPhoneNumber.UserPhoneNumberValidationSchema.safeParse(value);
    if (!parsedDateResult.success) {
      const errorMessage = parsedDateResult.error.message;
      throw new InvalidPhoneNumberException({
        message: `Phone Number validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserPhoneNumber(parsedDateResult.data);
  }

  public getValue() {
    return this.value;
  }
}
