
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
      labor.createdEmployeeKeyId = user.employeeKey?.employeeKeyId;
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

      await queryRunner.manager.save(labor);
        if (data.prisoners && data.prisoners.length > 0) {
        for (const p of data.prisoners) {
          const prisonerLaborId = p.prisonerLaborId || p.prisonerId;
          if (prisonerLaborId) {
            const existing = await queryRunner.manager.findOne(PriPrisonerLabor, {
              where: { laborId: data.laborId, prisonerKeyId: p.prisonerKeyId || p.prisonerId }
            });
            if (existing) {
              existing.isSalary = p.isSalary ? 1 : 0;
              existing.beginDate = data.beginDate;
              existing.laborTypeId = Number(data.laborTypeId);
              await queryRunner.manager.save(existing);
            }
          }
        }
      }

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
}
