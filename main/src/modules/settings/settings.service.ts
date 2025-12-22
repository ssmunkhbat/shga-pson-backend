import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RefDto } from 'src/dto/refDto';
import { DataSource } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { RedisService } from 'src/thirdparty/redis/redis.service';

const mapRef = {
  'role': 'ref_role',
};

const redisExpireInSec = 3600; // Cache data for 1 hour

@Injectable()
export class SettingsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly redisService: RedisService,
  ) {}

  async getList(refName: string, rawFilters: string) {
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }

    const changedKey = `${refName}-changed`;
    const isChanged = await this.redisService.get(changedKey);

    if (isChanged === 'true') {
      console.log(`Data for ${refName} has changed, refreshing cache...`);
      await this.refreshCache(refName, rawFilters);
      
      await this.redisService.set(changedKey, 'false');

      const freshData = await this.redisService.get(refName);
      return JSON.parse(freshData);
    }
    await this.redisService.set(changedKey, 'false');

    const cachedData = await this.redisService.get(refName);
    if (cachedData) {
      console.log(`Returning cached data for ${refName}`);
      return JSON.parse(cachedData);
    }
    return await this.refreshCache(refName, rawFilters);
  }

  private async refreshCache(refName: string, rawFilters: string) {
    let customFilter = '';
    if (rawFilters) {
      const filters = JSON.parse(rawFilters);
      filters.forEach((element) => {
        if (element.value) {
          customFilter += `and ${element.field} = ${
            typeof element.value === 'string' ? `'${element.value}'` : element.value
          }`;
        }
      });
    }

    const query = `SELECT * FROM ${mapRef[refName]} WHERE is_active = 1 ${customFilter} ORDER BY id DESC`;
    const result = await this.dataSource.query(query);

    await this.redisService.set(refName, JSON.stringify(result), redisExpireInSec);

    return plainToClass(RefDto, result, { excludeExtraneousValues: true });
  }

  async updateData(refName: string, newData: any) {
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }
    await this.redisService.set(refName, JSON.stringify(newData), redisExpireInSec);
    return plainToClass(RefDto, newData, { excludeExtraneousValues: true });
  }
}
