import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { LeaveView } from 'src/entity/pri/leave/leaveView.entity';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { Repository } from 'typeorm';

@Injectable()
export class LeaveService {
  constructor (
    @InjectRepository(LeaveView)
    private leaveViewRepository : Repository<LeaveView>
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.leaveViewRepository.createQueryBuilder('md')
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<LeaveView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }
}
