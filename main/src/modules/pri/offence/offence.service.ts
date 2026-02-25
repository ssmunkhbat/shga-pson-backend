import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { TableConfigService } from 'src/modules/table-config/table-config.service';
import { PriOffenceActionView } from 'src/entity/pri/offence/PriOffenceActionView.entity';

@Injectable()
export class OffenceService {
  constructor (
    @InjectRepository(PriOffenceActionView)
    private priOffenceActionRepository : Repository<PriOffenceActionView>,
    private readonly tableConfiService: TableConfigService,
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.priOffenceActionRepository.createQueryBuilder('md')
      .leftJoin("md.wfmStatus", "WS")
      .addSelect(['WS.wfmStatusId', 'WS.wfmStatusCode', 'WS.wfmStatusName', 'WS.wfmStatusColor', 'WS.wfmStatusBgColor'])
      .where('md.offenceActionId IS NOT NULL');
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.andWhere(filter, parameters)
    }
    if (user && user.userRole && user.userRole.roleId !== 100) {
      queryBuilder.andWhere('md.departmentId = :departmentId', { departmentId: user.employeeKey.departmentId })
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriOffenceActionView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }
  
  async downloadExcel(res: Response, user: any) {
    const page = 1, limit = 1000000, search = '[]', sort = '{}';
    const { rows } = await this.getList({ page, limit }, search, sort, user)
    const fileName = 'sample.xlsx';
    const dynamicTableName = 'offence-action-view'
    return this.tableConfiService.downloadExcel(res, dynamicTableName, rows, fileName);
  }
}
