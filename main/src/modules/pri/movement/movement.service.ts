import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { MovementDeparture } from 'src/entity/pri/movement/movementDeparture.entity';
import { MovementArrival } from 'src/entity/pri/movement/movementArrival.entity';
import { getFilter } from 'src/utils/helper';
import { Repository, DataSource } from 'typeorm';
import { CreateMovementDepartureDto } from 'src/dto/validation/pri/movement/movementDeparture.dto';
import { CreateMovementArrivalDto } from 'src/dto/validation/pri/movement/movementArrival.dto';
import { PriMovementDeparturePack } from 'src/entity/pri/movement/PriMovementDeparturePack';
import { ChangeMovementPasswordDto } from 'src/dto/validation/pri/movement/changeMovementPassword.dto';
import { PriMovementDeparture } from 'src/entity/pri/movement/PriMovementDeparture';
import { PriMovementArrivalPack } from 'src/entity/pri/movement/PriMovementArrivalPack';
import { PriMovementArrival } from 'src/entity/pri/movement/PriMovementArrival';
import { PriPrisonerKey } from 'src/entity/pri/prisoner/PriPrisonerKey';
import { PriPrisoner } from 'src/entity/pri/prisoner/priPrisoner';
import { getId } from 'src/utils/unique';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';

import { PriEmployee } from 'src/entity/pri/employee/priEmployee';
import { PriOfficer } from 'src/entity/pri/officer/PriOfficer';
import { PriAdministrativeDecision } from 'src/entity/pri/administrative/priAdministrativeDecision';
import { BasePerson } from 'src/entity/base/basePerson';

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
    @InjectRepository(PriMovementArrivalPack)
    private arrivalPackRepo: Repository<PriMovementArrivalPack>,
    @InjectRepository(PriMovementArrival)
    private arrivalRepo: Repository<PriMovementArrival>,
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
        password: dto.grantPassword,
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
      if (user.employeeKey?.departmentId) {
        queryBuilder[!!filter ? "andWhere" : "where"](
          "md.fromDepartmentId = :departmentId",
          { departmentId: user.employeeKey.departmentId }
        );
      }
    }

    queryBuilder.andWhere("md.wfmStatusId IN (:...statuses)", { statuses: [100302, 100303] });

    queryBuilder
      .orderBy('md.createdDate', 'DESC');
    
    const data = await paginate<MovementDeparture>(queryBuilder, options);
    
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
      if (user.employeeKey?.departmentId) {
        queryBuilder[!!filter ? "andWhere" : "where"](
          "md.toDepartmentId = :departmentId",
          { departmentId: user.employeeKey.departmentId }
        );
      }
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const DEPARTURE_STATUS_DELIVERED = 100303;
      const ARRIVAL_STATUS_ARRIVED = 100304;

      for (const departurePackId of dto.movementDepartureIds) {
        console.log(`-----departurepackid---------${departurePackId}`);
        const departurePack = await this.departurePackRepo.findOne({
          where: { movementDeparturePackId: departurePackId }
        });

        if (!departurePack) {
          console.error(`[Movement] DeparturePack ${departurePackId} NOT FOUND`);
          continue;
        }

        // Password Verification
        if (departurePack.password && departurePack.password !== dto.password) {
            throw new BadRequestException(`Нууц үг буруу байна! (ID: ${departurePackId})`);
        }

        const targetDepartmentId = departurePack.toDepartmentId;
        console.log(`------irsendepartment------- ${targetDepartmentId}`);

        // 1. 100303 shiljinirsen ni
        departurePack.wfmStatusId = DEPARTURE_STATUS_DELIVERED;
        await this.dynamicService.updateTableData(queryRunner, PriMovementDeparturePack, this.departurePackRepo, departurePack, user)

        // 2. 100304 shiljin ochson 
        const arrivalPackId = await getId();
        const arrivalPack = {
          movementArrivalPackId: arrivalPackId,
          movementDeparturePackId: departurePackId,
          arrivalDate: new Date(dto.arrivalDate),
          wfmStatusId: ARRIVAL_STATUS_ARRIVED,
          createdDate: new Date(),
          isActive: true
        };
        await this.dynamicService.createTableData(queryRunner, PriMovementArrivalPack, this.arrivalPackRepo, arrivalPack, user);

        const departureDetails = await this.departureRepo.find({
          where: { movementDeparturePackId: departurePackId }
        });

        for (const departureDetail of departureDetails) {
            const currentKey = await this.prisonerKeyRepository.findOne({
                where: { prisonerKeyId: departureDetail.prisonerKeyId }
            });

            if (currentKey) {
                currentKey.endDate = new Date(dto.arrivalDate);
                await this.dynamicService.updateTableData(queryRunner, PriPrisonerKey, this.prisonerKeyRepository, currentKey, user);

                const newKeyId = await getId();
                const newKey = {
                   prisonerKeyId: newKeyId,
                   prisonerId: currentKey.prisonerId,
                   departmentId: targetDepartmentId,
                   wfmStatusId: 17861, // Active
                   beginDate: new Date(dto.arrivalDate),
                   createdBy: user.employeeKey?.id,
                   createdDate: new Date(),
                   regimenId: currentKey.regimenId,
                   detentionId: currentKey.detentionId,
                   decisionId: currentKey.decisionId,
                   isActive: true
                };
                await this.dynamicService.createTableData(queryRunner, PriPrisonerKey, this.prisonerKeyRepository, newKey, user);

                const arrivalDetail = {
                   movementArrivalId: await getId(),
                   movementArrivalPackId: arrivalPackId,
                   movementDepartureId: departureDetail.movementDepartureId,
                   prisonerKeyId: newKeyId,
                   createdDate: new Date(),
                   isActive: true
                };
                await this.dynamicService.createTableData(queryRunner, PriMovementArrival, this.arrivalRepo, arrivalDetail, user);

                console.log(`--prisonerid--- (ID: ${currentKey.prisonerId}) ----haana irsen--- ${targetDepartmentId}, Status: 17861`);
                await queryRunner.manager.update(PriPrisoner, 
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
      await queryRunner.commitTransaction();
      return { success: true };
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500);
    } finally {
      await queryRunner.release();
    }
  }
  async changeDeparturePassword(user: any, dto: ChangeMovementPasswordDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const departurePack = await this.departurePackRepo.findOne({
        where: { movementDeparturePackId: dto.movementDeparturePackId }
      });

      if (!departurePack) {
        throw new BadRequestException('Шилжилт хөдөлгөөн олдсонгүй!');
      }

      const isCreator = user.employeeKey?.employeeKeyId === departurePack.createdEmployeeKeyId;
      const isAdmin = user.userId === 1;

      if (!isCreator && !isAdmin) {
         throw new BadRequestException('Та зөвхөн өөрийн үүсгэсэн бүртгэлийн нууц үгийг солих эрхтэй!');
      }

      if (departurePack.wfmStatusId !== 100302) {
        throw new BadRequestException('Зөвхөн "Замд яваа" төлөвтэй бүртгэлийн нууц үгийг солих боломжтой!');
      }


      departurePack.password = dto.newPassword;
      await this.dynamicService.updateTableData(queryRunner, PriMovementDeparturePack, this.departurePackRepo, departurePack, user);

      await queryRunner.commitTransaction();
      return { success: true };
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async getDepartureDetails(id: number) {
    const pack = await this.departurePackRepo.findOne({
      where: { movementDeparturePackId: id }
    });

    if (!pack) throw new BadRequestException('Not found');

    const manager = this.dataSource.manager;

    // Fetch employee name if employeeId exists
    let employeeName = '';
    if (pack.employeeId) {
    }
    
    // Fetch Employee
    if (pack.employeeId) {
        const emp = await this.dataSource.getRepository('PriEmployee').findOne({
            where: { employeeId: pack.employeeId },
            relations: ['person']
        }) as any;
        
        if (emp && emp.person) {
            employeeName = `${emp.person.lastName || ''} ${emp.person.firstName || ''}`.trim();
        }
    }

    // Fetch Officer
    let officerName = '';
    if (pack.officerId) {
        const officer = await this.dataSource.getRepository('PriOfficer').findOne({
            where: { officerId: pack.officerId }
        }) as any;

        if (officer) {
            officerName = `${officer.lastName || ''} ${officer.firstName || ''}`.trim();
        }
    }

    // Fetch Decision
    let decisionName = '';
    if (pack.decisionId) {
        const decision = await this.dataSource.getRepository('PriAdministrativeDecision').findOne({
            where: { administrativeDecisionId: pack.decisionId }
        }) as any;

        if (decision) {
            decisionName = decision.administrativeDecisionNumber || '';
        }
    }

    // Fetch prisoner movements with prisoner details
    const movements = await this.departureRepo.find({
      where: { movementDeparturePackId: id }
    });

    const prisonersWithDetails = [];
    for (const m of movements) {
      // Fetch prisoner info
      const prisonerKey = await this.prisonerKeyRepository.findOne({
          where: { prisonerKeyId: m.prisonerKeyId }
      });
      
      let prisonerCode = '';
      let firstName = '';
      let lastName = '';

      if (prisonerKey) {
          const prisoner = await this.dataSource.getRepository('PriPrisoner').findOne({
              where: { prisonerId: prisonerKey.prisonerId }
          }) as any;

          if (prisoner) {
              prisonerCode = prisoner.prisonerNumber;
              // Fetch prisoner ttah
              const person = await this.dataSource.getRepository('BasePerson').findOne({
                  where: { personId: prisoner.personId }
              }) as any;
              
              if (person) {
                  firstName = person.firstName;
                  lastName = person.lastName;
              }
          }
      }

      prisonersWithDetails.push({
          _id: m.prisonerKeyId,
          prisonerId: prisonerKey?.prisonerId,
          prisonerCode: prisonerCode,
          code: prisonerCode,
          firstName: firstName,
          lastName: lastName,
          reasonId: m.reasonId,
          regimenId: m.regimenId,
          classId: m.classId,
          description: m.description || '',
          isSpecialAttention: false
      });
    }

    return {
      ...pack,
      employeeName,
      officerName,
      decisionName,
      prisoners: prisonersWithDetails
    };
  }
}
