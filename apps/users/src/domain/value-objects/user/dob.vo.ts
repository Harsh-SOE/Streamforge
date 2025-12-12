import { z } from 'zod';

import { InvalidDobException } from '@users/domain/exceptions';

export class UserDOB {
  private static UserDOBValidationSchema = z
    .date()
    .optional()
    .refine(
      (dob) => {
        if (dob === undefined) return true;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let ageInYear = currentYear - dob.getFullYear();
        const hasBirthdayPassed =
          dob.getMonth() <= currentDate.getMonth() ||
          dob.getDate() <= currentDate.getDate();
        if (!hasBirthdayPassed) ageInYear--;
        return ageInYear >= 18;
      },
      { error: `Age must be greater than equal to 18 years` },
    );

  public constructor(private readonly value?: Date) {}

  public static create(value?: Date) {
    const parsedDateResult = UserDOB.UserDOBValidationSchema.safeParse(value);
    if (!parsedDateResult.success) {
      const errorMessage = parsedDateResult.error.message;
      throw new InvalidDobException({
        message: `DOB validation failed. Reason: ${errorMessage}`,
      });
    }
    return new UserDOB(parsedDateResult.data);
  }

  public getValue() {
    return this.value;
  }
}
