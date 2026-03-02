import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { DataSource, Repository } from 'typeorm';
import { Response } from 'express';
import { TableConfigService } from 'src/modules/table-config/table-config.service';
import { PriOffenceActionView } from 'src/entity/pri/offence/PriOffenceActionView.entity';
import { PriOffenceValidationDto } from 'src/dto/validation/pri/offence/offence.validation.dto';
import { getId } from 'src/utils/unique';
import { PriOffence } from 'src/entity/pri/offence/PriOffence.entity';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { PriOffenceView } from 'src/entity/pri/offence/PriOffenceView.entity';

@Injectable()
export class OffenceService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    private readonly dynamicService: DynamicService,
    @InjectRepository(PriOffenceActionView)
    private priOffenceActionRepository : Repository<PriOffenceActionView>,

    @InjectRepository(PriOffenceView)
    private priOffenceViewRepository : Repository<PriOffenceView>,

    @InjectRepository(PriOffence)
    private priOffenceRepository : Repository<PriOffence>,

    private readonly tableConfiService: TableConfigService,
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.priOffenceActionRepository.createQueryBuilder('md')
      .leftJoin("md.wfmStatus", "WS")
      .addSelect(['WS.wfmStatusId', 'WS.wfmStatusCode', 'WS.wfmStatusName', 'WS.wfmStatusColor', 'WS.wfmStatusBgColor'])
      .where('md.offenceActionId IS NOT NULL');
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.andWhere(filter, parameters)
    }
    if (user && user.userRole && user.userRole.roleId !== 100) {
      queryBuilder.andWhere('md.departmentId = :departmentId', { departmentId: user.employeeKey.departmentId })
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriOffenceActionView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }

  async getOffenceList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.priOffenceViewRepository.createQueryBuilder('md')
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.andWhere(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriOffenceView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }

  async getOffenceActionList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.priOffenceActionRepository.createQueryBuilder('md')
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.andWhere(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriOffenceActionView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }
  
  async downloadExcel(res: Response, user: any) {
    const page = 1, limit = 1000000, search = '[]', sort = '{}';
    const { rows } = await this.getList({ page, limit }, search, sort, user)
    const fileName = 'sample.xlsx';
    const dynamicTableName = 'offence-action-view'
    return this.tableConfiService.downloadExcel(res, dynamicTableName, rows, fileName);
  }

  async createAndUpdate(dto: PriOffenceValidationDto, user: any) {
    return dto.offenceId ? this.update(dto, user) : this.create(dto, user)
  }
  async create (dto: PriOffenceValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newData = Object.assign({...dto}, {
        offenceId: getId(),
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId,
      });
      await this.dynamicService.createTableData(queryRunner, PriOffence, this.priOffenceRepository, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async update (dto: PriOffenceValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = { ...dto };
      await this.dynamicService.updateTableData(queryRunner, PriOffence, this.priOffenceRepository, updateData, user)
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
      await this.dynamicService.deleteHardTableData(queryRunner, this.priOffenceRepository, id)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
}
