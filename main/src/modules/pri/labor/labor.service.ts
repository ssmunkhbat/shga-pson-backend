
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PriLaborView } from 'src/entity/pri/labor/PriLaborView';
import { PriLabor } from 'src/entity/pri/labor/PriLabor';
import { PriPrisonerLabor } from 'src/entity/pri/labor/PriPrisonerLabor';
import { getId } from 'src/utils/unique';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { PriPrisonerLaborView } from 'src/entity/pri/labor/PriPrisonerLaborView';


@Injectable()
export class PriLaborService {
  constructor(
    @InjectRepository(PriLaborView)
    private laborViewRepo: Repository<PriLaborView>,
    @InjectRepository(PriPrisonerLaborView)
    private prisonerLaborViewRepo: Repository<PriPrisonerLaborView>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getList(options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.laborViewRepo.createQueryBuilder('l');
    const { filter, parameters } = getFilterAndParameters('l', searchParam);
    
    if (filter) {
      queryBuilder.where(filter, parameters);
    }

    if (user && user.userId !== 1) {
      if (user.employeeKey?.departmentId) {
        queryBuilder.andWhere("l.departmentId = :departmentId", { departmentId: user.employeeKey.departmentId });
      }
    }

    const { field, order } = getSortFieldAndOrder('l', sortParam);
    if (field) {
      queryBuilder.orderBy(field, order);
    } else {
      queryBuilder.orderBy('l.beginDate', 'DESC');
    }

    const data = await paginate<PriLaborView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  async createAndUpdate(data: any, user: any) {
    if (data.laborId) {
      return this.update(data, user);
    } else {
      return this.create(data, user);
    }
  }

  async create(data: any, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const labor = new PriLabor();
      labor.laborId = await getId();
      labor.laborTypeId = Number(data.laborTypeId);
      labor.departmentId = Number(data.departmentId || user.employeeKey?.departmentId);
      labor.beginDate = data.beginDate;
      labor.endDate = data.endDate;
      labor.description = data.description;
      labor.createdEmployeeKeyId = user.employeeKey?.id;
      labor.createdDate = new Date();

      const savedLabor = await queryRunner.manager.save(labor);

      if (data.prisoners && data.prisoners.length > 0) {
        const details = [];
        for (const p of data.prisoners) {
            details.push({
                prisonerLaborId: await getId(),
                laborId: savedLabor.laborId,
                prisonerKeyId: p.prisonerId,
                laborTypeId: Number(savedLabor.laborTypeId),
                beginDate: savedLabor.beginDate,
                endDate: savedLabor.endDate,
                description: savedLabor.description,
                wfmStatusId: 17862,
                isSalary: p.isSalary ? 1 : 0,
                createdEmployeeKeyId: savedLabor.createdEmployeeKeyId,
                createdDate: new Date(),
            });
        }
        await queryRunner.manager.save(PriPrisonerLabor, details);
      }

      await queryRunner.commitTransaction();
      return savedLabor;

    } catch (err) {
      console.error('LaborService.create ERROR:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(data: any, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const labor = await queryRunner.manager.findOne(PriLabor, { where: { laborId: data.laborId } });
      if (!labor) throw new Error('Labor not found');

      labor.laborTypeId = Number(data.laborTypeId);
      labor.beginDate = data.beginDate;
      labor.endDate = data.endDate;
      labor.description = data.description;
      // Department usually doesn't change, or restricted. keeping as is.

      await queryRunner.manager.save(labor);
      
      // Update prisoners? Usually we might add/remove. 
      // For now, let's assume implementation for prisoners update is separate or not required yet based on current tasks.
      // But based on user request "code zagbar adilhan baina uu", we should match structure.
      // Decision service update uses dynamicService.updateTableData.
      // But Labor has complex child relations (minors). Decision is single table (mostly).
      // So manual update here is fine.

      await queryRunner.commitTransaction();
      return labor;

    } catch (err) {
      console.error('LaborService.update ERROR:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check if exists
      const labor = await queryRunner.manager.findOne(PriLabor, { where: { laborId: id } });
      if (!labor) throw new Error('Labor not found');

      // Delete details first
      await queryRunner.manager.delete(PriPrisonerLabor, { laborId: id });
      
      // Delete labor
      await queryRunner.manager.delete(PriLabor, { laborId: id });

      await queryRunner.commitTransaction();
    } catch (err) {
      console.error('LaborService.delete ERROR:', err);
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async finish(data: any, user: any) {
    const { prisonerLaborId, endDate, description, laborResultTypeId } = data;
    await this.dataSource.manager.update(PriPrisonerLabor, { prisonerLaborId }, {
      endDate: new Date(endDate),
      description: description,
      wfmStatusId: 17863,
      laborResultTypeId: laborResultTypeId,
    });
    return { success: true };
  }

  async getPrisonerList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.prisonerLaborViewRepo.createQueryBuilder('pl')
      .leftJoin("pl.wfmStatus", "WS").addSelect(['WS.wfmStatusId', 'WS.wfmStatusCode', 'WS.wfmStatusName', 'WS.wfmStatusColor', 'WS.wfmStatusBgColor']);
    const { filter, parameters } = getFilterAndParameters('pl', searchParam)
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('pl', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    } else {
      queryBuilder.orderBy('pl.createdDate', 'DESC')
    }
    
    const data = await paginate<PriPrisonerLaborView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }
  // async getPrisonerList(options: IPaginationOptions, searchParam: string, user: any) {
  //   try {
  //     const filter = searchParam && searchParam !== '[]' ? JSON.parse(searchParam) : null;
  //     const queryBuilder = this.dataSource.createQueryBuilder(PriPrisonerLabor, 'pl');

  //     queryBuilder
  //       .select([
  //         'pl.prisonerLaborId AS "prisonerLaborId"',
  //         'pl.laborId AS "laborId"',
  //         'pl.prisonerKeyId AS "prisonerKeyId"',
  //         'pl.laborTypeId AS "laborTypeId"',
  //         'pl.beginDate AS "beginDate"',
  //         'pl.endDate AS "endDate"',
  //         'pl.description AS "description"',
  //         'pl.wfmStatusId AS "wfmStatusId"',
  //         'pl.isSalary AS "isSalary"',
  //         'pl.laborResultTypeId AS "laborResultTypeId"',
  //         'pl.createdDate AS "createdDate"',
          
  //         // Joined columns with UPPERCASE aliases and quoted output aliases
  //         "BP.LAST_NAME || ' ' || BP.FIRST_NAME AS \"prisonerName\"",
  //         'P.PRISONER_NUMBER AS "registerNo"',
  //         'LT.NAME AS "laborTypeName"',
  //         'WS.WFM_STATUS_NAME AS "statusName"',
  //         'NVL(D.NAME, PD.NAME) AS "departmentName"', // Fallback to Prisoner Department
  //         'LRT.NAME AS "laborResultTypeName"'
  //       ])
  //       .leftJoin('PRI_PRISONER_KEY', 'K', 'pl.prisonerKeyId = K.PRISONER_KEY_ID')
  //       .leftJoin('PRI_PRISONER', 'P', 'K.PRISONER_ID = P.PRISONER_ID')
  //       .leftJoin('BASE_PERSON', 'BP', 'P.PERSON_ID = BP.PERSON_ID')
  //       .leftJoin('PRI_LABOR', 'L', 'pl.laborId = L.LABOR_ID')
  //       .leftJoin('PRI_INFO_DEPARTMENT', 'D', 'L.DEPARTMENT_ID = D.DEPARTMENT_ID')
  //       .leftJoin('PRI_INFO_DEPARTMENT', 'PD', 'P.DEPARTMENT_ID = PD.DEPARTMENT_ID') // Join Prisoner Department
  //       .leftJoin('PRI_INFO_LABOR_TYPE', 'LT', 'pl.laborTypeId = LT.LABOR_TYPE_ID')
  //       .leftJoin('WFM_STATUS', 'WS', 'pl.wfmStatusId = WS.WFM_STATUS_ID')
  //       .leftJoin('PRI_INFO_LABOR_RESULT_TYPE', 'LRT', 'pl.laborResultTypeId = LRT.LABOR_RESULT_TYPE_ID');

  //     if (filter) {
  //         if (filter.prisonerLaborId) {
  //             queryBuilder.andWhere('pl.prisonerLaborId = :prisonerLaborId', { prisonerLaborId: filter.prisonerLaborId });
  //         }
  //     }

  //     queryBuilder.orderBy('pl.createdDate', 'DESC');

  //     const limit = Number(options.limit) || 10;
  //     const page = Number(options.page) || 1;
  //     const skip = (page - 1) * limit;

  //     const total = await queryBuilder.getCount();
  //     const rows = await queryBuilder.offset(skip).limit(limit).getRawMany();

  //     return {
  //       items: rows,
  //       meta: {
  //         totalItems: total,
  //         itemCount: rows.length,
  //         itemsPerPage: limit,
  //         totalPages: Math.ceil(total / limit),
  //         currentPage: page,
  //       },
  //       rows: rows, 
  //       total,
  //       page,
  //       limit,
  //       totalPages: Math.ceil(total / limit),
  //     };
  //   } catch (error) {
  //     console.error('Error in LaborService.getPrisonerList:', error);
  //     throw error;
  //   }
  // }
}
