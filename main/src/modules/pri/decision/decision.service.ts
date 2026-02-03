import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriDecisionValidationDto } from 'src/dto/validation/pri/decision.dto';
import { PriDecision } from 'src/entity/pri/decision/priDecision';
import { PriDecisionView } from 'src/entity/pri/decision/priDecisionView';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilter } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PriDecisionService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriDecisionView)
    private decisionViewRepo: Repository<PriDecisionView>,
    private readonly dynamicService: DynamicService,
  ) {}

  //#region [LIST]
  
  async list(options: IPaginationOptions, searchParam) {
    const filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('dec', filterVals)
    }

    const queryBuilder = this.decisionViewRepo.createQueryBuilder('dec')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('dec.createdDate', 'DESC')
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
      const newData = Object.assign(dto, {
        decisionId: await getId(),
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

