import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';
import { PriEmployeeKey } from 'src/entity/pri/employee/priEmployeeKey';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriEmployeeKey)
    private employeeKeyViewRepo: Repository<PriEmployeeKey>,
  ) {}

  async list(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('ek', filterVals)
    }
    const queryBuilder = this.employeeKeyViewRepo.createQueryBuilder('ek')
      .innerJoinAndSelect("ek.employee", "EMP")
        .leftJoin("EMP.person", "PER").addSelect(['PER.firstName', 'PER.lastName', 'PER.stateRegNumber'])
        .leftJoin("EMP.user", "USR").addSelect(['USR.userName'])
      .where('ek.isActive = 1')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('ek.createdDate', 'DESC')
    const data = await paginate<PriEmployeeKey>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

}

