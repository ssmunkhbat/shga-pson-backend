import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriDecisionValidationDto } from 'src/dto/validation/pri/decision.dto';
import { PriDecision } from 'src/entity/pri/decision/priDecision';
import { PriDecisionView } from 'src/entity/pri/decision/priDecisionView';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilter, getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Not, Repository } from 'typeorm';

@Injectable()
export class PriDecisionService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriDecisionView)
    private decisionViewRepo: Repository<PriDecisionView>,
    private readonly dynamicService: DynamicService,
  ) {}

  //#region [LIST]
  
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any, permissionLevel?: number) {
    const queryBuilder = this.decisionViewRepo.createQueryBuilder('dec')
      .leftJoin("dec.decisionType", "DT").addSelect(['DT.decisionTypeId', 'DT.code', 'DT.name'])
    const { filter, parameters } = getFilterAndParameters('dec', searchParam)
    console.log('-------filter-------', filter);
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('dec', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    } else {
      queryBuilder.orderBy('dec.createdDate', 'DESC')
    }
    console.log('-------field, order-------', field, order)

    console.log('-------permissionLevel-------', permissionLevel)
    if (permissionLevel === 2) {
      if (user.employeeKey?.departmentId) {
        queryBuilder[!!filter ? "andWhere" : "where"](
          "dec.departmentId = :departmentId",
          { departmentId: user.employeeKey.departmentId }
        );
      }
    }
    
    const data = await paginate<PriDecisionView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  //#endregion

  //#region [CRUD]
  
  async createAndUpdate(dto: PriDecisionValidationDto, user: any) {
    return dto.decisionId
      ? this.update(dto, user)
      : this.create(dto, user);
  }

  async create(dto: PriDecisionValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const exist = await queryRunner.manager.findOne(PriDecision, {
        where: { decisionNumber: dto.decisionNumber },
      });
      if (exist) {
        throw new BadRequestException(`${dto.decisionNumber} шийдвэрийн дугаар давхардаж байна!`)
      }
      const newData = Object.assign(dto, {
        decisionId: await getId(),
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId
      });
      await this.dynamicService.createTableData(queryRunner, PriDecision, this.decisionViewRepo, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async update(dto: PriDecisionValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // const count = await queryRunner.manager.count(PriDecision, {
      //   where: { decisionNumber: dto.decisionNumber, decisionId: Not(dto.decisionId) },
      // });
      // if (count > 0) {
      //   throw new BadRequestException(`${dto.decisionNumber} шийдвэрийн дугаар давхардаж байна!`);
      // }
      const found = await queryRunner.manager.findOne(PriDecision, {
        where: { decisionId: dto.decisionId },
      });
      if (!found) {
        throw new BadRequestException(`Бүртгэл олдсонгүй!`)
      }
      const updateData = dto;
      await this.dynamicService.updateTableData(queryRunner, PriDecision, this.decisionViewRepo, updateData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.dynamicService.deleteHardTableData(queryRunner, this.decisionViewRepo, id)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  //#endregion

}

