import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
import { PriMovementArrival } from 'src/entity/pri/movement/PriMovementArrival';
import { PriPrisonerKey } from 'src/entity/pri/prisoner/PriPrisonerKey';
import { PriPrisoner } from 'src/entity/pri/prisoner/priPrisoner';
import { getId } from 'src/utils/unique';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';

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
    private readonly dynamicService: DynamicService,
    @InjectRepository(PriMovementDeparturePack)
    private departurePackRepo: Repository<PriMovementDeparturePack>,
    @InjectRepository(PriMovementDeparture)
    private departureRepo: Repository<PriMovementDeparture>,
  ) { }

  // async registerDeparture(user: any, dto: CreateMovementDepartureDto) {
  //   console.log(`--------------Departure haanas id-----------${dto.fromDepartmentId} ---------haasha:${dto.toDepartmentId}`);
  //   return this.dataSource.transaction(async manager => {
  //     const pack = new PriMovementDeparturePack();
  //     pack.movementDeparturePackId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 100).toString());
  //     pack.departureDate = new Date(dto.departureDate);
  //     pack.fromDepartmentId = dto.fromDepartmentId;
  //     pack.toDepartmentId = dto.toDepartmentId;
  //     pack.decisionId = dto.decisionId;
  //     pack.officerId = dto.officerId;
  //     pack.employeeId = dto.employeeId; 
  //     // pack.grantPassword = dto.grantPassword;
  //     pack.wfmStatusId = 100302;
  //     pack.movementTypeId = dto.movementTypeId;
  //     pack.numberOfPrisoners = dto.prisoners.length;
  //     // pack.createdEmployeeKeyId = user.userId; // User ID is not a valid Employee Key ID, causing FK error
  //     pack.createdDate = new Date();

  //     await manager.save(pack);
  //     console.log(`------------ ussen departurepackid----------${pack.movementDeparturePackId}`);
  //     for (const p of dto.prisoners) {
  //       const detail = new PriMovementDeparture();
  //       // Ensure unique ID for detail even in same loop
  //       await new Promise(r => setTimeout(r, 1)); // tiny delay or better random
  //       detail.movementDepartureId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString());
        
  //       detail.movementDeparturePackId = pack.movementDeparturePackId;
  //       detail.prisonerKeyId = p.prisonerKeyId;
  //       detail.reasonId = p.reasonId;
  //       detail.regimenId = p.regimenId;
  //       detail.classId = p.classId;
  //       detail.description = p.description;
  //       // detail.isSpecialAttention = p.isSpecialAttention;
  //       // detail.createdUserId = user.userId;
  //       detail.createdDate = new Date();
        
  //       await manager.save(detail);

  //       // Update Prisoner Status to "En Route" (100302)
  //       const prisonerKey = await manager.findOne(PriPrisonerKey, {
  //         where: { prisonerKeyId: p.prisonerKeyId }
  //       });

  //       if (prisonerKey) {
  //           console.log(`---------prisoner_ke_ID----${prisonerKey.prisonerKeyId} (---prisonerid-- ${prisonerKey.prisonerId})`);
  //           prisonerKey.wfmStatusId = 100302; // Departed Status
  //           await manager.save(prisonerKey);
  //       }
  //     }
  //     return pack;
  //   });
  // }
  async registerDeparture(user: any, dto: CreateMovementDepartureDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const wfmStatusId = 100302;
      const movementDeparturePackId = await getId();
      const packNewItem = {
        movementDeparturePackId: movementDeparturePackId,
        departureDate: new Date(dto.departureDate),
        fromDepartmentId: dto.fromDepartmentId,
        toDepartmentId: dto.toDepartmentId,
        decisionId: dto.decisionId,
        officerId: dto.officerId,
        employeeId: dto.employeeId, 
        wfmStatusId: wfmStatusId,
        movementTypeId: dto.movementTypeId,
        numberOfPrisoners: dto.prisoners.length,
        isActive: true,
        createdEmployeeKeyId: user?.employeeKey?.employeeKeyId,
        createdDate: new Date(),
      };
      await this.dynamicService.createTableData(queryRunner, PriMovementDeparturePack, this.departurePackRepo, packNewItem, user)
      for (const p of dto.prisoners) {
        const prisonerKey = await this.prisonerKeyRepository.findOne({
          where: { prisonerKeyId: p.prisonerKeyId }
        });
        if (!prisonerKey) {
          throw new BadRequestException('Хоригдогч олдсонгүй!');
        }
        console.log(`---------prisoner_ke_ID----${prisonerKey.prisonerKeyId} (---prisonerid-- ${prisonerKey.prisonerId})`);
        prisonerKey.wfmStatusId = wfmStatusId;
        await this.dynamicService.updateTableData(queryRunner, PriPrisonerKey, this.prisonerKeyRepository, prisonerKey, user)
        const departureNewItem = {
          movementDepartureId: await getId(),
          movementDeparturePackId: movementDeparturePackId,
          prisonerKeyId: p.prisonerKeyId,
          reasonId: p.reasonId,
          regimenId: p.regimenId,
          classId: p.classId,
          description: p.description,
          createdDate: new Date(),
        };
        await this.dynamicService.createTableData(queryRunner, PriMovementDeparture, this.departureRepo, departureNewItem, user)
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }


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

    queryBuilder.andWhere("md.wfmStatusId IN (:...statuses)", { statuses: [100302, 100303] });

    queryBuilder
      .orderBy('md.createdDate', 'DESC');
    
    const data = await paginate<MovementDeparture>(queryBuilder, options);
    
    // Inject Arrival Date
    const mappedItems = data.items.map(item => {
        (item as any).arrivalDate = (item as any).arrivalPack?.arrivalDate;
        return item;
    });

    return { rows: mappedItems, total: data.meta.totalItems };
  }
  async getArrivalList(options: IPaginationOptions, searchParam: string, user: any) {
    let filterVals = JSON.parse(searchParam);
    let filter = getFilter('md', filterVals);
    
    const queryBuilder = this.departureRepository
      .createQueryBuilder('md')
      .leftJoinAndMapOne("md.arrivalPack", PriMovementArrivalPack, "map", "map.movementDeparturePackId = md.movementDeparturePackId")

    if (filter) {
      queryBuilder.where(filter);
    }
    
    if (user.userId !== 1) {
      queryBuilder[!!filter ? "andWhere" : "where"](
        "md.toDepartmentId = :departmentId",
        { departmentId: user.employeeKey.departmentId }
      );
    }

    queryBuilder.andWhere("md.wfmStatusId IN (:...statuses)", { statuses: [100302, 100303] });
    queryBuilder
      .orderBy('COALESCE(map.createdDate, md.createdDate)', 'DESC');
    
    const data = await paginate<MovementDeparture>(queryBuilder, options);

    const mappedItems = data.items.map(item => {
      (item as any).arrivalDate = (item as any).arrivalPack?.arrivalDate;

      if (item.wfmStatusId === 100303) {
        item.wfmStatusId = 100304;
        item.wfmStatusName = 'Шилжин ирсэн';
      }
      return item;
    });

    return { rows: mappedItems, total: data.meta.totalItems };
  }

  async registerArrival(user: any, dto: CreateMovementArrivalDto) {
    console.log(`-----useriindeptid---- ${user.employeeKey?.departmentId}`);
    return this.dataSource.transaction(async manager => {
      const DEPARTURE_STATUS_DELIVERED = 100303;
      const ARRIVAL_STATUS_ARRIVED = 100304;

      for (const departurePackId of dto.movementDepartureIds) {
        console.log(`-----departurepackid---------${departurePackId}`);
        const departurePack = await manager.findOne(PriMovementDeparturePack, {
            where: { movementDeparturePackId: departurePackId }
        });

        if (!departurePack) {
            console.error(`[Movement] DeparturePack ${departurePackId} NOT FOUND`);
            continue;
        }

        const targetDepartmentId = departurePack.toDepartmentId;
        console.log(`------irsendepartment------- ${targetDepartmentId}`);

        // 1. 100303 shiljinirsen ni
        await manager.createQueryBuilder()
          .update(PriMovementDeparturePack)
          .set({ wfmStatusId: DEPARTURE_STATUS_DELIVERED })
          .where("movementDeparturePackId = :id", { id: departurePackId })
          .execute();

        // 2. 100304 shiljin ochson 
        const arrivalPack = new PriMovementArrivalPack();
        arrivalPack.movementArrivalPackId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 100).toString());
        arrivalPack.movementDeparturePackId = departurePackId;
        arrivalPack.arrivalDate = new Date(dto.arrivalDate);
        arrivalPack.wfmStatusId = ARRIVAL_STATUS_ARRIVED;
        arrivalPack.createdDate = new Date();
        await manager.save(arrivalPack);
        console.log(`-----uussenarrivalpackid------: ${arrivalPack.movementArrivalPackId}`);

        
        const departureDetails = await manager.find(PriMovementDeparture, {
          where: { movementDeparturePackId: departurePackId }
        });

        for (const departureDetail of departureDetails) {
            // Find the current Prisoners Key using ID from departure detail
            const currentKey = await manager.findOne(PriPrisonerKey, {
                where: { prisonerKeyId: departureDetail.prisonerKeyId }
            });

            if (currentKey) {
                currentKey.endDate = new Date(dto.arrivalDate);
                await manager.save(currentKey);

                const newKey = new PriPrisonerKey();
                newKey.prisonerKeyId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString());
                newKey.prisonerId = currentKey.prisonerId;
                newKey.departmentId = targetDepartmentId; 
                newKey.wfmStatusId = 17861; 
                newKey.beginDate = new Date(dto.arrivalDate);
                newKey.createdBy = user.employeeKey?.id;
                newKey.createdDate = new Date();
                newKey.regimenId = currentKey.regimenId;
                newKey.detentionId = currentKey.detentionId;
                newKey.decisionId = currentKey.decisionId;

                await manager.save(newKey);

                // 4. Create Arrival Detail Record (PRI_MOVEMENT_ARRIVAL)
                const arrivalDetail = new PriMovementArrival();
                arrivalDetail.movementArrivalId = Number(new Date().getTime().toString() + Math.floor(Math.random() * 1000).toString()); 
                arrivalDetail.movementArrivalPackId = arrivalPack.movementArrivalPackId;
                arrivalDetail.movementDepartureId = departureDetail.movementDepartureId;
                arrivalDetail.prisonerKeyId = newKey.prisonerKeyId; // Link to the NEW key (active in this dept)
                arrivalDetail.createdDate = new Date();
                
                await manager.save(arrivalDetail);

                console.log(`--prisonerid--- (ID: ${currentKey.prisonerId}) ----haana irsen--- ${targetDepartmentId}, Status: 17861`);
                await manager.update(PriPrisoner, 
                    { prisonerId: currentKey.prisonerId }, 
                    { 
                        departmentId: targetDepartmentId, 
                        wfmStatusId: 17861 
                    }
                );
            } else {
                console.warn(`notfooundkeyid ${departureDetail.prisonerKeyId}`);
            }
        }
      }

      return {
        messageType: 'success',
        message: 'Amjilttai'
      };
    });
  }
}
