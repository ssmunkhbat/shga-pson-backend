import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriTrainingValidationDto } from 'src/dto/validation/pri/training/training.validation.dto';
import { PriTraining } from 'src/entity/pri/training/PriTraining.entity';
import { PriTrainingPrisoner } from 'src/entity/pri/training/PriTrainingPrisoner.entity';
import { PriTrainingPrisonerKeyView } from 'src/entity/pri/training/PriTrainingPrisonerKeyView.entity';
import { PriTrainingView } from 'src/entity/pri/training/PriTrainingView.entity';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TrainingService {
  constructor (
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriTrainingView)
    private priTrainingViewRepository : Repository<PriTrainingView>,
    @InjectRepository(PriTraining)
    private priTrainingRepository : Repository<PriTraining>,
    @InjectRepository(PriTrainingPrisoner)
    private priTrainingPrisonerRepository : Repository<PriTrainingPrisoner>,

    @InjectRepository(PriTrainingPrisonerKeyView)
    private priTrainingPrisonerKeyViewRepository: Repository<PriTrainingPrisonerKeyView>,

    private readonly dynamicService: DynamicService,
  ) {}
  getHello () : string {
    return 'hello'
  }
  async getList (options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    try {
      const queryBuilder = this.priTrainingViewRepository.createQueryBuilder('md')
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
      const data = await paginate<PriTrainingView>(queryBuilder, options)
      return {
        rows: data.items,
        total: data.meta.totalItems
      }
    } catch (err) {
      console.error(err)
      throw err
    }
  }

  async createAndUpdate(dto: PriTrainingValidationDto, user: any) {
    return dto.trainingId ? this.update(dto, user) : this.create(dto, user)
  }
  async create (dto: PriTrainingValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const prisonerKeys = dto.prisonerKeys
      delete dto.prisonerKeys;
      const newData = Object.assign(dto, {
        trainingId: await getId(),
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId,
        departmentId: user.employeeKey.departmentId
      });
      const prisoners : PriTrainingPrisoner[] = prisonerKeys.map(c => {
        const prisoner = new PriTrainingPrisoner();
        prisoner.trainingPrisonerId = getId();
        prisoner.trainingId = newData.trainingId;
        prisoner.prisonerKeyId = c;
        prisoner.createdDate = new Date();
        prisoner.createdEmployeeKeyId = user.employeeKey.employeeKeyId;
        return prisoner;
      })
      await this.dynamicService.createTableData(queryRunner, PriTraining, this.priTrainingRepository, newData, user)
      await queryRunner.manager.save(prisoners)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.error(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async update (dto: PriTrainingValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const prisonerKeys = await this.priTrainingPrisonerRepository.find({ where: { trainingId: dto.trainingId } })
      const deletePrisonerKeys = prisonerKeys.filter(c => !dto.prisonerKeys.includes(c.prisonerKeyId)).map(c => c.trainingPrisonerId)
      const insertPrisonerKeys = dto.prisonerKeys.filter(c => !prisonerKeys.some(k => k.prisonerKeyId === c))
      const updateData = dto;
      const prisoners : PriTrainingPrisoner[] = insertPrisonerKeys.map(c => {
        const prisoner = new PriTrainingPrisoner();
        prisoner.trainingPrisonerId = getId();
        prisoner.trainingId = updateData.trainingId;
        prisoner.prisonerKeyId = c;
        prisoner.createdDate = new Date();
        prisoner.createdEmployeeKeyId = user.employeeKey.employeeKeyId;
        return prisoner;
      })
      await this.dynamicService.updateTableData(queryRunner, PriTraining, this.priTrainingRepository, updateData, user)
      if (deletePrisonerKeys.length > 0) {
        await queryRunner.manager.delete(this.priTrainingPrisonerRepository.target, deletePrisonerKeys);
      }
      await queryRunner.manager.save(prisoners)
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
      await queryRunner.manager.delete(this.priTrainingPrisonerRepository.target, { trainingId: id })
      await this.dynamicService.deleteHardTableData(queryRunner, this.priTrainingRepository, id)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }
  async getPriTrainingPrisoners (trainingId: number) {
    return this.priTrainingPrisonerKeyViewRepository.find({ where: { trainingId }})
  }
}
