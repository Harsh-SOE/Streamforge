/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// log-execution-time.decorator.ts
import { performance } from 'perf_hooks';
import { Logger } from '@nestjs/common';

export function LogExecutionTime(): MethodDecorator {
  return <T>(
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>,
  ): TypedPropertyDescriptor<T> => {
    const originalMethod = descriptor.value as (...args: any[]) => any;

    descriptor.value = async function (...args: unknown[]) {
      const start = performance.now();

      const result = await originalMethod.apply(this, args);

      const end = performance.now();
      const duration = (end - start).toFixed(5);

      Logger.log(`[${String(propertyKey)}] Execution time: ${duration} ms`);

      return result;
    } as T;

    return descriptor;
  };
}
