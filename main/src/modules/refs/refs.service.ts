import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RefDto } from 'src/dto/refDto';
import { DataSource } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { RedisService } from 'src/thirdparty/redis/redis.service';
import { getId } from 'src/utils/unique';

const mapRef = {
  'role': 'ref_role',
  'mt-prisoner': 'PRI_MOVEMENT_TYPE_PRISONER',
};

const redisExpireInSec = 3600; // Cache data for 1 hour

@Injectable()
export class RefsService {
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

    const query = `SELECT * FROM ${mapRef[refName]} WHERE is_active = 1 ${customFilter}`; // ORDER BY id DESC
    const result = await this.dataSource.query(query);

    await this.redisService.set(refName, JSON.stringify(result), redisExpireInSec);

    return plainToClass(RefDto, result, { excludeExtraneousValues: true });
  }
  
  async createRef(refName, data) {
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }
    
    const generatedId = await getId()
    const newData = {
      id: generatedId, 
      name: data.name,
      isActive: data.isActive,
      sortDefault: Number(data.sortDefault)
    }
    const changedKey = `${refName}-changed`;
    await this.redisService.set(changedKey, 'true');
    await this.redisService.set(refName, JSON.stringify(newData), redisExpireInSec);

    const queryBuilder = this.dataSource
      .createQueryBuilder()
      .insert()
      .into(`${refName}`)
      .values([newData]);
    return await queryBuilder.execute();
  }

  async updateRef(refName, id, data) {
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }

    const updateData = {
      name: data.name,
      isActive: data.isActive,
      sortDefault: data.sortDefault
    }
    const changedKey = `${refName}-changed`;
    await this.redisService.set(changedKey, 'true');
    await this.dataSource.createQueryBuilder().update(refName).set(updateData).where("id=:id", { id }).execute()
  }
}
