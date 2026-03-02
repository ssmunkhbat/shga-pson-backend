import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';
import { BasePerson } from 'src/entity/base/basePerson'

@Injectable()
export class BasePersonService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(BasePerson)
    private employeeKeyViewRepo: Repository<BasePerson>,
  ) {}

  async list(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('bp', filterVals)
    }
    const queryBuilder = this.employeeKeyViewRepo.createQueryBuilder('bp')
      // .innerJoinAndSelect("bp.employee", "EMP")
      //   .leftJoin("EMP.person", "PER").addSelect(['PER.firstName', 'PER.lastName', 'PER.stateRegNumber'])
      //   .leftJoin("EMP.user", "USR").addSelect(['USR.userName'])
      .where('bp.isActive = 1')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('bp.createdDate', 'DESC')
    const data = await paginate<BasePerson>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

}

