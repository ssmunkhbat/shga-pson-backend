
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';
import { PriOfficer } from 'src/entity/pri/officer/PriOfficer';

@Injectable()
export class OfficerService {
  constructor(
    @InjectRepository(PriOfficer)
    private officerRepository: Repository<PriOfficer>,
  ) {}

  async getList(options: IPaginationOptions, searchParam: string) {
    let filterVals = JSON.parse(searchParam);
    let filter = getFilter('o', filterVals);

    const queryBuilder = this.officerRepository
      .createQueryBuilder('o');
      // .where('o.isActive = 1'); // Column does not exist in DB

    if (filter) {
      queryBuilder.andWhere(filter);
    }
    
    queryBuilder.orderBy('o.firstName', 'ASC');

    const count = await queryBuilder.getCount();
    console.log('OfficerService: Count with filter:', count);
    console.log('OfficerService: SQL:', queryBuilder.getSql());

    return paginate<PriOfficer>(queryBuilder, options);
  }
}
