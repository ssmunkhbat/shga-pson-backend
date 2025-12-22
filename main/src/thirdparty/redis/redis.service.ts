import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
  ) { }

  async set(key: string, value: string, expireInSec?: number): Promise<string | null> {
    if (expireInSec !== undefined) {
      return await this.redisClient.setex(key, expireInSec, value);
    }
    return await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
  
}