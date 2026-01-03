import Redis from 'ioredis';
import { Inject, Injectable } from '@nestjs/common';

export const REDIS_HOST = Symbol('REDIS_HOST');
export const REDIS_PORT = Symbol('REDIS_PORT');

@Injectable()
export class RedisClient {
  public constructor(
    @Inject(REDIS_HOST) private readonly host: string,
    @Inject(REDIS_PORT) private readonly port: number,
  ) {}

  public getClient() {
    return new Redis(`${this.host}:${this.port}`, { lazyConnect: true });
  }
}
