import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriRotlValidationDto } from 'src/dto/validation/pri/rotl/rotl.validation.dto';
import { PriPersonSymptom } from 'src/entity/pri/symptom/PriPersonSymptom.entity';
import { PriPersonSymptomView } from 'src/entity/pri/symptom/PriPersonSymptomView.entity';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SymptomService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPersonSymptomView)
    private rotlPersonSymptomViewRepository : Repository<PriPersonSymptomView>,
    @InjectRepository(PriPersonSymptom)
    private priPersonSymptomRepository : Repository<PriPersonSymptom>,
    private readonly dynamicService: DynamicService,
  ) {}
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.rotlPersonSymptomViewRepository.createQueryBuilder('md');
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriPersonSymptomView>(queryBuilder, options)
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
      await this.dynamicService.createTableData(queryRunner, PriPersonSymptom, this.priPersonSymptomRepository, newData, user)
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
      await this.dynamicService.updateTableData(queryRunner, PriPersonSymptom, this.priPersonSymptomRepository, updateData, user)
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
      await this.dynamicService.deleteHardTableData(queryRunner, this.priPersonSymptomRepository, id)
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
