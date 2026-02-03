import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { LeaveView } from 'src/entity/pri/leave/leaveView.entity';
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
  async getList (options: IPaginationOptions, searchParam: string, user: any) {
    const queryBuilder = this.leaveViewRepository.createQueryBuilder('md')
    const data = await paginate<LeaveView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }
}
