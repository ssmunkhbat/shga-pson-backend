import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriPrisonerBodyAttributeValidationDto } from 'src/dto/validation/pri/body-attribute/body-attribute.validation.dto';
import { PriPrisonerBodyAttribute } from 'src/entity/pri/body-attribute/PriPrisonerBodyAttribute.entity';
import { PriPrisonerBodyAttributeView } from 'src/entity/pri/body-attribute/PriPrisonerBodyAttributeView.entity';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BodyAttributeService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisonerBodyAttributeView)
    private priPrisonerBodyAttributeViewRepository : Repository<PriPrisonerBodyAttributeView>,

    @InjectRepository(PriPrisonerBodyAttribute)
    private priPrisonerBodyAttributeRepository : Repository<PriPrisonerBodyAttribute>,

    private readonly dynamicService: DynamicService,
  ) {}
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.priPrisonerBodyAttributeViewRepository.createQueryBuilder('md');
    const { filter, parameters } = getFilterAndParameters('md', searchParam)
    if (filter) {
      queryBuilder.where(filter, parameters)
    }
    const { field, order } = getSortFieldAndOrder('md', sortParam)
    if (field) {
      queryBuilder.orderBy(field, order)
    }
    const data = await paginate<PriPrisonerBodyAttributeView>(queryBuilder, options)
    return {
      rows: data.items,
      total: data.meta.totalItems
    }
  }

  async createAndUpdate(dto: PriPrisonerBodyAttributeValidationDto, user: any) {
    return dto.prisonerBodyAttributeId ? this.update(dto, user) : this.create(dto, user)
  }
  async create (dto: PriPrisonerBodyAttributeValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newData = Object.assign({...dto}, {
        prisonerBodyAttributeId: getId(),
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId,
      });
      await this.dynamicService.createTableData(queryRunner, PriPrisonerBodyAttribute, this.priPrisonerBodyAttributeRepository, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async update (dto: PriPrisonerBodyAttributeValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = { ...dto };
      await this.dynamicService.updateTableData(queryRunner, PriPrisonerBodyAttribute, this.priPrisonerBodyAttributeRepository, updateData, user)
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
      await this.dynamicService.deleteHardTableData(queryRunner, this.priPrisonerBodyAttributeRepository, id)
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
