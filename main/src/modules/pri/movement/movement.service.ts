import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { MovementDeparture } from 'src/entity/pri/movement/movementDeparture.entity';
import { MovementArrival } from 'src/entity/pri/movement/movementArrival.entity';
import { getFilter } from 'src/utils/helper';
import { Repository, DataSource } from 'typeorm';
import { CreateMovementDepartureDto } from './dto/CreateMovementDeparture.dto';
import { CreateMovementArrivalDto } from './dto/CreateMovementArrival.dto';
import { PriMovementDeparturePack } from 'src/entity/pri/movement/PriMovementDeparturePack';
import { PriMovementDeparture } from 'src/entity/pri/movement/PriMovementDeparture';
import { PriMovementArrivalPack } from 'src/entity/pri/movement/PriMovementArrivalPack';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementDeparture)
    private departureRepository: Repository<MovementDeparture>,
    @InjectRepository(MovementArrival)
    private arrivalRepository: Repository<MovementArrival>,
    private dataSource: DataSource,
  ) { }

  async registerDeparture(user: any, dto: CreateMovementDepartureDto) {
    return this.dataSource.transaction(async manager => {
      const pack = new PriMovementDeparturePack();
      pack.movementDeparturePackId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 100).toString());
      pack.departureDate = new Date(dto.departureDate);
      pack.fromDepartmentId = dto.fromDepartmentId;
      pack.toDepartmentId = dto.toDepartmentId;
      pack.decisionId = dto.decisionId;
      pack.officerId = dto.officerId;
      pack.officerName = dto.officerName;
      pack.grantPassword = dto.grantPassword;
      pack.wfmStatusId = 100302;
      pack.movementTypeId = 1;
      pack.numberOfPrisoners = dto.prisoners.length;
      pack.createdBy = user.userId; // user object should have userId
      pack.createdDate = new Date();

      await manager.save(pack);

      for (const p of dto.prisoners) {
        const detail = new PriMovementDeparture();
        // Ensure unique ID for detail even in same loop
        await new Promise(r => setTimeout(r, 1)); // tiny delay or better random
        detail.movementDepartureId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString());
        
        detail.movementDeparturePackId = pack.movementDeparturePackId;
        detail.prisonerKeyId = p.prisonerKeyId;
        detail.reasonId = p.reasonId;
        detail.regimenId = p.regimenId;
        detail.classId = p.classId;
        detail.description = p.description;
        detail.isSpecialAttention = p.isSpecialAttention;
        detail.createdBy = user.userId;
        detail.createdDate = new Date();
        
        await manager.save(detail);

        // Update Prisoner Status? 
        // In old system, `PRI_PRISONER_KEY` likely has status/department.
        // But for now, just insert the movement record.
        // The View `PRI_MOVEMENT_DEPARTURE_PACK_VW` should pick it up.
      }
      return pack;
    });
  }

  async registerArrival(user: any, dto: CreateMovementArrivalDto) {
      const arrival = new PriMovementArrivalPack();
      arrival.movementArrivalPackId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 100).toString());
      arrival.movementDeparturePackId = dto.movementDeparturePackId;
      arrival.arrivalDate = new Date(dto.arrivalDate);
      arrival.createdBy = user.userId;
      arrival.createdDate = new Date();
      
      return this.dataSource.manager.save(arrival);
  }

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
