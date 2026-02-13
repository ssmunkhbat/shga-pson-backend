import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriRotlValidationDto } from 'src/dto/validation/pri/rotl/rotl.validation.dto';
import { PriRotlReceivedValidationDto } from 'src/dto/validation/pri/rotl/rotlReceived.validation.dto';
import { PriRotl } from 'src/entity/pri/rotl/PriRotl.entity';
import { PriRotlView } from 'src/entity/pri/rotl/PriRotlView.entity';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RotlService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriRotlView)
    private rotlViewRepository : Repository<PriRotlView>,
    @InjectRepository(PriRotl)
    private priRotlRepository : Repository<PriRotl>,
    private readonly dynamicService: DynamicService,
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.rotlViewRepository.createQueryBuilder('md')
      .leftJoin("md.wfmStatus", "WS").addSelect(['WS.wfmStatusId', 'WS.wfmStatusCode', 'WS.wfmStatusName', 'WS.wfmStatusColor', 'WS.wfmStatusBgColor']);
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    if (user.userRole.roleId !== 100) {
      queryBuilder.andWhere('md.departmentId = :departmentId', { departmentId: user.employeeKey.departmentId })
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriRotlView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }

  async createAndUpdate(dto: PriRotlValidationDto, user: any) {
    return dto.rotlId ? this.update(dto, user) : this.create(dto, user)
  }
  async create (dto: PriRotlValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newData = Object.assign(dto, {
        rotlId: await getId(),
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId
      });
      await this.dynamicService.createTableData(queryRunner, PriRotl, this.priRotlRepository, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async update (dto: PriRotlValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = dto;
      await this.dynamicService.updateTableData(queryRunner, PriRotl, this.priRotlRepository, updateData, user)
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
      await this.dynamicService.deleteHardTableData(queryRunner, this.priRotlRepository, id)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async received (dto: PriRotlReceivedValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = { ...dto, wfmStatusId: 100602 };
      await this.dynamicService.updateTableData(queryRunner, PriRotl, this.priRotlRepository, updateData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
}
