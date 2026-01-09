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
import { PriPrisonerKey } from 'src/entity/pri/prisoner/PriPrisonerKey';

@Injectable()
export class MovementService {
  constructor(
    @InjectRepository(MovementDeparture)
    private departureRepository: Repository<MovementDeparture>,
    @InjectRepository(MovementArrival)
    private arrivalRepository: Repository<MovementArrival>,
    @InjectRepository(PriPrisonerKey)
    private prisonerKeyRepository: Repository<PriPrisonerKey>,
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
      pack.employeeId = dto.employeeId; 
      // pack.grantPassword = dto.grantPassword;
      pack.wfmStatusId = 100302;
      pack.movementTypeId = dto.movementTypeId;
      pack.numberOfPrisoners = dto.prisoners.length;
      // pack.createdEmployeeKeyId = user.userId; // User ID is not a valid Employee Key ID, causing FK error
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
        // detail.isSpecialAttention = p.isSpecialAttention;
        // detail.createdUserId = user.userId;
        detail.createdDate = new Date();
        
        await manager.save(detail);

        await manager.save(detail);

        // Update Prisoner Status to "En Route" (100302)
        const prisonerKey = await manager.findOne(PriPrisonerKey, {
          where: { prisonerKeyId: p.prisonerKeyId }
        });

        if (prisonerKey) {
            prisonerKey.wfmStatusId = 100302; // Departed Status
            await manager.save(prisonerKey);
        }
      }
      return pack;
    });
  }

  async registerArrival(user: any, dto: CreateMovementArrivalDto) {
    return this.dataSource.transaction(async manager => {
      const arrival = new PriMovementArrivalPack();
      arrival.movementArrivalPackId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 100).toString());
      arrival.movementDeparturePackId = dto.movementDeparturePackId;
      arrival.arrivalDate = new Date(dto.arrivalDate);
      // arrival.createdUserId = user.userId;
      arrival.createdDate = new Date();
      
      const savedArrival = await manager.save(arrival);

      // Get Movement Departure Pack and Details to identify prisoners
      const departureDetails = await manager.find(PriMovementDeparture, {
          where: { movementDeparturePackId: dto.movementDeparturePackId }
      });

      const departurePack = await manager.findOne(PriMovementDeparturePack, {
          where: { movementDeparturePackId: dto.movementDeparturePackId }
      });

      for (const departureDetail of departureDetails) {
          // Find the current Prisoners Key (which should be "Departure" status 100302)
          const currentKey = await manager.findOne(PriPrisonerKey, {
              where: { prisonerKeyId: departureDetail.prisonerKeyId }
          });

          if (currentKey) {
              // 1. Close current key
              currentKey.endDate = new Date(dto.arrivalDate); // Set End Date as Arrival Date
              await manager.save(currentKey);

              // 2. Create NEW key for the new Department
              const newKey = new PriPrisonerKey();
              // Generate new ID (Assuming simplistic approach or sequence if required, using Random for now as per project style)
              newKey.prisonerKeyId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString());
              newKey.prisonerId = currentKey.prisonerId;
              newKey.departmentId = departurePack.toDepartmentId; // New Department
              newKey.wfmStatusId = 100301; // Active Status
              newKey.beginDate = new Date(dto.arrivalDate);
              newKey.createdBy = user.userId;
              newKey.createdDate = new Date();
              
              // Copy other attributes
              newKey.regimenId = currentKey.regimenId;
              newKey.detentionId = currentKey.detentionId;
              newKey.decisionId = currentKey.decisionId;

              await manager.save(newKey);
          }
      }

      return savedArrival;
    });
  }

  /**
   * Шилжин явсан бүртгэлийн жагсаалт
   */
  async getDepartureList(options: IPaginationOptions, searchParam: string, user: any) {
    let filterVals = JSON.parse(searchParam);
    let filter = getFilter('md', filterVals);
    
    const queryBuilder = this.departureRepository
      .createQueryBuilder('md')

    if (filter) {
      queryBuilder.where(filter);
    }

    if (user.userId !== 1) {
      queryBuilder[!!filter ? "andWhere" : "where"](
        "md.fromDepartmentId = :departmentId",
        { departmentId: user.employeeKey.departmentId }
      );
    }

    queryBuilder
      .orderBy('md.createdDate', 'DESC');
    
    const data = await paginate<MovementDeparture>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems };
  }

  /**
   * Шилжин ирсэн бүртгэлийн жагсаалт
   */
  async getArrivalList(options: IPaginationOptions, searchParam: string, user: any) {
    let filterVals = JSON.parse(searchParam);
    let filter = getFilter('ma', filterVals);
    
    const queryBuilder = this.arrivalRepository
      .createQueryBuilder('ma');

    if (filter) {
      queryBuilder.where(filter);
    }

    if (user.userId !== 1) {
      queryBuilder[!!filter ? "andWhere" : "where"](
        "ma.toDepartmentId = :departmentId",
        { departmentId: user.employeeKey.departmentId }
      );
    }

    queryBuilder
      .orderBy('ma.createdDate', 'DESC');
    
    const data = await paginate<MovementArrival>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems };
  }
}
