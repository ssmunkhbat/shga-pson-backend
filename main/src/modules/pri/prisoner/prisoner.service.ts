import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PriPrisonerKeyView } from 'src/entity/pri/prisoner/priPrisonerKeyView';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class PrisonerService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisonerKeyView)
    private prisonerKeyViewRepo: Repository<PriPrisonerKeyView>,
  ) {}

  async listAll(options: IPaginationOptions, searchParam) {
    // let filterVals = JSON.parse(searchParam)
    // let filter = getFilter('su', filterVals)
    const queryBuilder = this.prisonerKeyViewRepo.createQueryBuilder('su')
      // .where(filter)
      .orderBy('su.createdDate', 'DESC')
    const data = await paginate<PriPrisonerKeyView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

}

