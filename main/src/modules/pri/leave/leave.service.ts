import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriLeaveValidationDto } from 'src/dto/validation/pri/leave/leave.validation.dto';
import { LeaveView } from 'src/entity/pri/leave/leaveView.entity';
import { PriLeave } from 'src/entity/pri/leave/priLeave.entity';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class LeaveService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(LeaveView)
    private leaveViewRepository : Repository<LeaveView>,
    @InjectRepository(PriLeave)
    private priLeaveRepository : Repository<LeaveView>,
    private readonly dynamicService: DynamicService,
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.leaveViewRepository.createQueryBuilder('md')
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<LeaveView>(queryBuilder, options)
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
}
