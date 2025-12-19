import { uuid } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { InvalidViewIdException } from '@views/domain/exceptions';

export class ViewId {
  private static ViewIdValidationSchema = uuid();

  public constructor(private value: string) {}

  public static create(value?: string) {
    if (!value) {
      value = uuidv4();
    }

    const parsedViewId = ViewId.ViewIdValidationSchema.safeParse(value);

    if (!parsedViewId.success) {
      const errorMessage = parsedViewId.error.message;
      throw new InvalidViewIdException({
        message: `ViewId validation has failed: ${errorMessage}`,
      });
    }

    return new ViewId(parsedViewId.data);
  }

  public getValue(): string {
    return this.value;
  }
}
