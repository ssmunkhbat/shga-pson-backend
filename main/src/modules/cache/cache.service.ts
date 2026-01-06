import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/thirdparty/redis/redis.service';

const redisExpireInSec = 3600;

@Injectable()
export class CacheService {
  constructor(private readonly redisService: RedisService) {}

  private changedKey(refName: string): string {
    return `${refName}-changed`;
  }

  async isChanged(refName: string): Promise<boolean> {
    return (await this.redisService.get(this.changedKey(refName))) === 'true';
  }

  async markAsChanged(refName: string): Promise<void> {
    await this.redisService.set(this.changedKey(refName), 'true');
  }

  async resetChanged(refName: string): Promise<void> {
    await this.redisService.set(this.changedKey(refName), 'false');
  }

  async getCache<T>(key: string): Promise<T | null> {
    const data = await this.redisService.get(key);
    return data ? JSON.parse(data) : null;
  }

  async setCache(key: string, value: any, ttl = redisExpireInSec): Promise<void> {
    await this.redisService.set(key, JSON.stringify(value), ttl);
  }
}
