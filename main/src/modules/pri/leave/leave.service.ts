import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriLeaveValidationDto } from 'src/dto/validation/pri/leave/leave.validation.dto';
import { PriLeaveReceivedValidationDto } from 'src/dto/validation/pri/leave/leaveReceived.validation.dto';
import { PriLeaveView } from 'src/entity/pri/leave/PriLeaveView.entity';
import { PriLeave } from 'src/entity/pri/leave/PriLeave.entity';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilterAndParameters, getNestedValue, getSortFieldAndOrder } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Response } from 'express';
import { TableConfigService } from 'src/modules/table-config/table-config.service';
const moment = require("moment");

@Injectable()
export class LeaveService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriLeaveView)
    private leaveViewRepository : Repository<PriLeaveView>,
    @InjectRepository(PriLeave)
    private priLeaveRepository : Repository<PriLeave>,
    private readonly dynamicService: DynamicService,
    private readonly tableConfiService: TableConfigService,
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.leaveViewRepository.createQueryBuilder('md')
      .leftJoin("md.wfmStatus", "WS").addSelect(['WS.wfmStatusId', 'WS.wfmStatusCode', 'WS.wfmStatusName', 'WS.wfmStatusColor', 'WS.wfmStatusBgColor']);
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    if (user && user.userRole && user.userRole.roleId !== 100) {
      queryBuilder.andWhere('md.departmentId = :departmentId', { departmentId: user.employeeKey.departmentId })
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriLeaveView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }

  async createAndUpdate(dto: PriLeaveValidationDto, user: any) {
    return dto.leaveId ? this.update(dto, user) : this.create(dto, user)
  }
  async create (dto: PriLeaveValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newData = Object.assign(dto, {
        leaveId: await getId(),
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId
      });
      await this.dynamicService.createTableData(queryRunner, PriLeave, this.priLeaveRepository, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async update (dto: PriLeaveValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = dto;
      await this.dynamicService.updateTableData(queryRunner, PriLeave, this.priLeaveRepository, updateData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async delete (id : number, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.dynamicService.deleteHardTableData(queryRunner, this.priLeaveRepository, id)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async received (dto: PriLeaveReceivedValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = { ...dto, wfmStatusId: 100502 };
      await this.dynamicService.updateTableData(queryRunner, PriLeave, this.priLeaveRepository, updateData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  
  async downloadExcel(res: Response, user: any) {
    const page = 1, limit = 10, search = '[]', sort = '{}';
    const { rows } = await this.getList({ page, limit }, search, sort, user)

    const fileName = 'sample.xlsx';
    const dynamicTableName = 'leave-view'
    return this.tableConfiService.downloadExcel(res, dynamicTableName, rows, fileName);
  }
}
