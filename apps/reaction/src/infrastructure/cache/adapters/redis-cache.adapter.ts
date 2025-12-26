import * as fs from 'fs';
import { join } from 'path';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { getShardFor } from '@app/counters';
import { RedisClient } from '@app/clients/redis';
import { LOGGER_PORT, LoggerPort } from '@app/ports/logger';
import { RedisCacheHandler } from '@app/handlers/redis-cache-handler';

import { ReactionCachePort } from '@reaction/application/ports';

import { RedisWithCommands } from '../types';

@Injectable()
export class RedisCacheAdapter implements OnModuleInit, ReactionCachePort {
  private readonly SHARDS: number = 64;
  private client: RedisWithCommands;

  public constructor(
    private readonly redisCacheHandler: RedisCacheHandler,
    @Inject(LOGGER_PORT) private readonly logger: LoggerPort,
    private readonly redis: RedisClient,
  ) {}

  public onModuleInit() {
    const likeScript = fs.readFileSync(join(__dirname, 'scripts/like.lua'), 'utf8');

    const unlikeScript = fs.readFileSync(join(__dirname, 'scripts/unlike.lua'), 'utf8');

    const dislikeScript = fs.readFileSync(join(__dirname, 'scripts/dislike.lua'), 'utf8');

    const undislikeScript = fs.readFileSync(join(__dirname, 'scripts/undislike.lua'), 'utf8');

    this.redis.client.defineCommand('videoLikesCountIncr', {
      numberOfKeys: 4,
      lua: likeScript,
    });

    this.redis.client.defineCommand('videoLikesCountDecr', {
      numberOfKeys: 2,
      lua: unlikeScript,
    });

    this.redis.client.defineCommand('videoDislikesCountIncr', {
      numberOfKeys: 4,
      lua: dislikeScript,
    });

    this.redis.client.defineCommand('videoDislikesCountDecr', {
      numberOfKeys: 2,
      lua: undislikeScript,
    });

    this.client = this.redis.client as RedisWithCommands;

    this.logger.info('✅ Scripts intialized');
  }

  getShardKey(videoId: string, userId: string, shard: number = 64) {
    return getShardFor(videoId + userId, shard);
  }

  getVideoLikesCounterKey(videoId: string, shardNum: number) {
    return `videoLikesCounter:${videoId}:${shardNum}`;
  }

  getVideoDislikeCounterKey(videoId: string, shardNum: number) {
    return `videoDislikesCounter:${videoId}:${shardNum}`;
  }

  getUserLikesSetKey(videoId: string) {
    return `videoLikedByUsers:${videoId}`;
  }

  getUserDislikesSetKey(videoId: string) {
    return `videoDislikedByUsers:${videoId}`;
  }

  public async getTotalLikes(videoId: string): Promise<number> {
    const allShardedKeys = Array.from({ length: this.SHARDS }, (_, i) =>
      this.getVideoLikesCounterKey(videoId, i),
    );

    const getValuesOperations = async () => await this.client.mget(...allShardedKeys);

    const values = await this.redisCacheHandler.execute(getValuesOperations, {
      operationType: 'READ_MANY',
      keys: allShardedKeys,
    });

    const totalLikes = values.reduce(
      (sum, currentValue) => sum + (currentValue ? parseInt(currentValue, 10) : 0),
      0,
    );

    return totalLikes;
  }

  public async getTotalDislikes(videoId: string): Promise<number> {
    const allShardedKeys = Array.from({ length: this.SHARDS }, (_, i) =>
      this.getVideoDislikeCounterKey(videoId, i),
    );

    const getValuesOperations = async () => await this.client.mget(...allShardedKeys);

    const values = await this.redisCacheHandler.execute(getValuesOperations, {
      operationType: 'READ_MANY',
      keys: allShardedKeys,
    });

    const totalDislikes = values.reduce(
      (sum, currentValue) => sum + (currentValue ? parseInt(currentValue, 10) : 0),
      0,
    );

    return totalDislikes;
  }

  public async recordLike(videoId: string, userId: string): Promise<number> {
    const shardNum = this.getShardKey(videoId, userId);
    const usersDislikedSetKey = this.getUserDislikesSetKey(videoId);
    const usersLikedSetKey = this.getUserLikesSetKey(videoId);
    const videoDislikeCounterKey = this.getVideoDislikeCounterKey(videoId, shardNum);
    const videoLikeCounterKey = this.getVideoLikesCounterKey(videoId, shardNum);

    return await this.client.videoLikesCountIncrScriptFunction(
      usersLikedSetKey,
      usersDislikedSetKey,
      videoLikeCounterKey,
      videoDislikeCounterKey,
      userId,
    );
  }

  public async removeLike(videoId: string, userId: string): Promise<number> {
    const shardNum = this.getShardKey(videoId, userId);
    const usersLikedSetKey = this.getUserLikesSetKey(videoId);
    const videoLikeCounterKey = this.getVideoLikesCounterKey(videoId, shardNum);

    return await this.client.videoLikesCountDecrScriptFunction(
      usersLikedSetKey,
      videoLikeCounterKey,
      userId,
    );
  }

  public async recordDislike(videoId: string, userId: string): Promise<number> {
    const shardNum = this.getShardKey(videoId, userId);
    const usersDislikedSetKey = this.getUserDislikesSetKey(videoId);
    const usersLikedSetKey = this.getUserLikesSetKey(videoId);
    const videoDislikeCounterKey = this.getVideoDislikeCounterKey(videoId, shardNum);
    const videoLikeCounterKey = this.getVideoLikesCounterKey(videoId, shardNum);

    return await this.client.videoDislikesCountIncrScriptFunction(
      usersDislikedSetKey,
      usersLikedSetKey,
      videoDislikeCounterKey,
      videoLikeCounterKey,
      userId,
    );
  }

  public async removeDislike(videoId: string, userId: string): Promise<number> {
    const shardNum = this.getShardKey(videoId, userId);
    const usersDislikedSetKey = this.getUserDislikesSetKey(videoId);
    const videoDislikeCounterKey = this.getVideoDislikeCounterKey(videoId, shardNum);

    return await this.client.videoDislikesCountDecrScriptFunction(
      usersDislikedSetKey,
      videoDislikeCounterKey,
      userId,
    );
  }
}
