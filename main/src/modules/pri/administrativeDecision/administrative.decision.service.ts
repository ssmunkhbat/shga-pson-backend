import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';
import { PriAdministrativeDecision } from 'src/entity/pri/administrative/priAdministrativeDecision';

@Injectable()
export class AdministrativeDecisionService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriAdministrativeDecision)
    private decisionRepo: Repository<PriAdministrativeDecision>,
  ) {}

  async list(options: IPaginationOptions, searchParam) {
    let filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('de', filterVals)
    }
    const queryBuilder = this.decisionRepo.createQueryBuilder('de')
      .leftJoin("de.decisionType", "DT").addSelect(['DT.decisionTypeId', 'DT.code', 'DT.name', 'DT.isActive'])
      .innerJoinAndSelect("de.employee", "EMP")
        .leftJoin("EMP.person", "PER").addSelect(['PER.firstName', 'PER.lastName', 'PER.stateRegNumber'])
        // .leftJoin("EMP.user", "USR").addSelect(['USR.userName'])
      .leftJoin("de.department", "D").addSelect(['D.departmentId', 'D.code', 'D.name', 'D.departmentTypeId'])
      // .where('de.isActive = 1')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('de.createdDate', 'DESC')
    const data = await paginate<PriAdministrativeDecision>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

}

