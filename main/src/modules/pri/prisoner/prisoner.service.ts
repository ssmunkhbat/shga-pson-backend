import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PriPrisonerKeyView } from 'src/entity/pri/prisoner/priPrisonerKeyView';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';

@Injectable()
export class PrisonerService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisonerKeyView)
    private prisonerKeyViewRepo: Repository<PriPrisonerKeyView>,
  ) {}

  async listAll(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    console.log('-------filterVals---------', filterVals)
    let filter = null
    if (filterVals) {
      filter = getFilter('su', filterVals)
    }
    console.log('-------filter---------', filter)

    const queryBuilder = this.prisonerKeyViewRepo.createQueryBuilder('su')
      .where('su.endDate IS NULL')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('su.createdDate', 'DESC')
    const data = await paginate<PriPrisonerKeyView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

}

