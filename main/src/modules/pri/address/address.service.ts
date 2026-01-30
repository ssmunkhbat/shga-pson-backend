import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriAddress } from 'src/entity/pri/address/priAddress';
import { getFilter } from 'src/utils/helper';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PriAddressService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriAddress)
    private addressRepo: Repository<PriAddress>,
  ) {}

  //#region [LIST]
  
  async list(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
    filter = getFilter('addr', filterVals)
    }

    const queryBuilder = this.addressRepo.createQueryBuilder('addr')
      .leftJoinAndSelect("addr.addressType", "addressType")
      .leftJoinAndSelect("addr.aimag", "aimag")
      .leftJoinAndSelect("addr.soum", "soum")
      .leftJoinAndSelect("addr.bag", "bag")
      .leftJoinAndSelect("addr.country", "country")
    
    if (filter) queryBuilder.andWhere(filter)
    // queryBuilder.orderBy('addr.createdDate', 'DESC')
    const data = await paginate<PriAddress>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  //#endregion

}

