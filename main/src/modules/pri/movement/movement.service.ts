import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { MovementDeparture } from 'src/entity/pri/movement/movementDeparture.entity';
import { MovementArrival } from 'src/entity/pri/movement/movementArrival.entity';
import { getFilter } from 'src/utils/helper';
import { Repository } from 'typeorm';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementDeparture)
    private departureRepository: Repository<MovementDeparture>,
    @InjectRepository(MovementArrival)
    private arrivalRepository: Repository<MovementArrival>,
  ) { }

  /**
   * Шилжин явсан бүртгэлийн жагсаалт
   */
  async getDepartureList(options: IPaginationOptions, searchParam: string) {
    let filterVals = JSON.parse(searchParam);
    let filter = getFilter('md', filterVals);
    
    const queryBuilder = this.departureRepository
      .createQueryBuilder('md');

    if (filter) {
      queryBuilder.where(filter);
    }

    queryBuilder
      .orderBy('md.createdDate', 'DESC');
    
    const data = await paginate<MovementDeparture>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems };
  }

  /**
   * Шилжин ирсэн бүртгэлийн жагсаалт
   */
  async getArrivalList(options: IPaginationOptions, searchParam: string) {
    let filterVals = JSON.parse(searchParam);
    let filter = getFilter('ma', filterVals);
    
    const queryBuilder = this.arrivalRepository
      .createQueryBuilder('ma');

    if (filter) {
      queryBuilder.where(filter);
    }

    queryBuilder
      .orderBy('ma.createdDate', 'DESC');
    
    const data = await paginate<MovementArrival>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems };
  }
}
