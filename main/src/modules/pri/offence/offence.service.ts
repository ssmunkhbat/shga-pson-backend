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
import { PriDisciplineCellBook } from 'src/entity/pri/discipline-cell-book/discipline-cell-book.entity';
import { PriLabor } from 'src/entity/pri/labor/PriLabor';
import { PriPrisonerBonusDay } from 'src/entity/pri/prisoner-bonus-day/prisoner-bonus-day.entity';
import { PriOffenceActionValidationDto } from 'src/dto/validation/pri/offence/offence-action.validation.dto';
import { PriOffenceAction } from 'src/entity/pri/offence/PriOffenceAction.entity';

@Injectable()
export class OffenceService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    private readonly dynamicService: DynamicService,

    @InjectRepository(PriOffenceActionView)
    private priOffenceActionViewRepository : Repository<PriOffenceActionView>,

    @InjectRepository(PriOffenceView)
    private priOffenceViewRepository : Repository<PriOffenceView>,

    @InjectRepository(PriOffence)
    private priOffenceRepository : Repository<PriOffence>,

    @InjectRepository(PriOffenceAction)
    private priOffenceActionRepository : Repository<PriOffenceAction>,

    @InjectRepository(PriDisciplineCellBook)
    private priDisciplineCellBookRepository : Repository<PriDisciplineCellBook>,

    @InjectRepository(PriLabor)
    private priLaborRepository : Repository<PriLabor>,

    @InjectRepository(PriPrisonerBonusDay)
    private priPrisonerBonusDayRepository : Repository<PriPrisonerBonusDay>,

    private readonly tableConfiService: TableConfigService,
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.priOffenceActionViewRepository.createQueryBuilder('md')
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
    const queryBuilder = this.priOffenceActionViewRepository.createQueryBuilder('md')
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

  async getOffenceActionDetail (offenceActionId: number) {
    const item = await this.priOffenceActionRepository.findOne({ where: { offenceActionId }})
    if (item.offenceActionTypeId === 1) {
      const bonusDay = await this.priPrisonerBonusDayRepository.findOne({
        where: {
          prisonerBonusDayId: item.prisonerBonusDayId
        }
      })
      return {
        dateOfBonus: bonusDay.dateOfBonus,
        days: bonusDay.days
      }
    } else if (item.offenceActionTypeId === 2) {
      const discipline = await this.priDisciplineCellBookRepository.findOne({
        where: {
          disciplineCellId: item.disciplineCellBookId
        }
      })
      return {
        beginDate: discipline.beginDate,
        endDate: discipline.endDate
      }
    } else if (item.offenceActionTypeId === 3) {
      const labor = await this.priLaborRepository.findOne({
        where: {
          laborId: item.prisonerLaborId
        }
      })
      return {
        laborTypeId: labor.laborTypeId,
        beginDate: labor.beginDate,
        endDate: labor.endDate
      }
    }
  }
  
  async downloadExcel(res: Response, user: any) {
    const page = 1, limit = 1000000, search = '[]', sort = '{}';
    const { rows } = await this.getList({ page, limit }, search, sort, user)
    const fileName = 'sample.xlsx';
    const dynamicTableName = 'offence-action-view'
    return this.tableConfiService.downloadExcel(res, dynamicTableName, rows, fileName);
  }
  async createAndUpdateAction(dto: PriOffenceActionValidationDto, user: any) {
    return dto.offenceActionId ? this.updateAction(dto, user) : this.createAction(dto, user)
  }
  async createAction (dto: PriOffenceActionValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newData = Object.assign({...dto}, {
        offenceActionId: getId(),
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId,
      });
      await this.dynamicService.createTableData(queryRunner, PriOffenceAction, this.priOffenceActionRepository, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async updateAction (dto: PriOffenceActionValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = { ...dto };
      await this.dynamicService.updateTableData(queryRunner, PriOffenceAction, this.priOffenceActionRepository, updateData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
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
