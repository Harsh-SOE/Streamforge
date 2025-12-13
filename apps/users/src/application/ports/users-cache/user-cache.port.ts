export interface UserCachePort {
  getFromCache(key: string): Promise<string | undefined>;

  setInCache(key: string, value: string, ttl: number): Promise<boolean>;

  deleteFromCache(key: string): Promise<boolean>;

  setMultipleValuesInCache(
    data: Array<{ key: string; value: string; ttl?: number }>,
  ): Promise<boolean>;

  getMultipleValuesFromCache(keys: Array<string>): Promise<string[]>;

  deleteMultipleValuesFromCache(keys: Array<string>): Promise<boolean>;
}

export const USER_CACHE_PORT = Symbol('USER_CACHE_PORT');
