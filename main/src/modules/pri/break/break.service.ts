
import { HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { paginate, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PriPrisonerBreak } from 'src/entity/pri/break/PriPrisonerBreak';
import { PriPrisonerBreakView } from 'src/entity/pri/break/PriPrisonerBreakView';
import { PriPrisoner } from 'src/entity/pri/prisoner/priPrisoner';
import { PriPrisonerKey } from 'src/entity/pri/prisoner/PriPrisonerKey';
import { PriRelease } from 'src/entity/pri/release/PriRelease';
import { getId } from 'src/utils/unique';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { PriPrisonerBreakValidationDto } from 'src/dto/validation/pri/break.dto';
import { PriBreakFoundValidationDto } from 'src/dto/validation/pri/breakFound.dto';

@Injectable()
export class PriPrisonerBreakService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisonerBreakView)
    private prisonerBreakViewRepo: Repository<PriPrisonerBreakView>,
    @InjectRepository(PriPrisonerBreak)
    private prisonerBreakRepo: Repository<PriPrisonerBreak>,
    @InjectRepository(PriPrisoner)
    private prisonerRepo: Repository<PriPrisoner>,
    @InjectRepository(PriPrisonerKey)
    private prisonerKeyRepo: Repository<PriPrisonerKey>,
    @InjectRepository(PriRelease)
    private releaseRepo: Repository<PriRelease>,
    private readonly dynamicService: DynamicService,
  ) {}

  async getList(options: IPaginationOptions, searchParam: string, sortParam: string, user: any) {
    const queryBuilder = this.prisonerBreakViewRepo.createQueryBuilder('pb');
    const { filter, parameters } = getFilterAndParameters('pb', searchParam);
    
    queryBuilder.where('pb.isActive = :isActive', { isActive: 1 });

    if (filter) {
      queryBuilder.andWhere(filter, parameters);
    }

    const { field, order } = getSortFieldAndOrder('pb', sortParam);
    if (field) {
      queryBuilder.orderBy(field, order);
    } else {
      queryBuilder.orderBy('pb.createdDate', 'DESC');
    }

    const data = await paginate<PriPrisonerBreakView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  async createAndUpdate(dto: PriPrisonerBreakValidationDto, user: any) {
    return dto.prisonerBreakId ? this.update(dto, user) : this.create(dto, user);
  }

  async create(dto: PriPrisonerBreakValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const newData = Object.assign(dto, {
            prisonerBreakId: await getId(),
            createdDate: new Date(),
            createdEmployeeKeyId: user?.employeeKey?.employeeKeyId,
            wfmStatusId: 100401,
            isActive: 1,
        });

        await this.dynamicService.createTableData(queryRunner, PriPrisonerBreak, this.prisonerBreakRepo, newData, user);

        await this.dynamicService.updateTableData(queryRunner, PriPrisonerKey, this.prisonerKeyRepo, {
            prisonerKeyId: dto.prisonerKeyId,
            wfmStatusId: 100401
        }, user);

        const prisonerKey = await this.prisonerKeyRepo.findOne({ where: { prisonerKeyId: dto.prisonerKeyId } });
        if(prisonerKey){
             await this.dynamicService.updateTableData(queryRunner, PriPrisoner, this.prisonerRepo, {
                prisonerId: prisonerKey.prisonerId,
                wfmStatusId: 100401
            }, user);
        }

        const releaseData = {
            releaseId: await getId(),
            prisonerKeyId: dto.prisonerKeyId,
            releaseTypeId: 1668024005679, // Оргох
            releaseDate: new Date(dto.breakDate),
            createdDate: new Date(),
            createdEmployeeKeyId: user?.employeeKey?.employeeKeyId,
            description: dto.description || 'Оргосон'
        };
        await this.dynamicService.createTableData(queryRunner, PriRelease, this.releaseRepo, releaseData, user);

        await queryRunner.commitTransaction();
    } catch (err) {
        console.error('PriPrisonerBreakService.create ERROR:', err);
        await queryRunner.rollbackTransaction();
        throw new HttpException(err, 500);
    } finally {
        await queryRunner.release();
    }
  }

  async update(dto: PriPrisonerBreakValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const updateDataWithStatus = { ...dto, wfmStatusId: 100401 };

        await this.dynamicService.updateTableData(queryRunner, PriPrisonerBreak, this.prisonerBreakRepo, updateDataWithStatus, user);
        await queryRunner.commitTransaction();
    } catch (err) {
        console.error('PriPrisonerBreakService.update ERROR:', err);
        await queryRunner.rollbackTransaction();
         throw new HttpException(err, 500);
    } finally {
        await queryRunner.release();
    }
  }

  async found(dto: PriBreakFoundValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const updateData = { ...dto, wfmStatusId: 100402 };
      await this.dynamicService.updateTableData(queryRunner, PriPrisonerBreak, this.prisonerBreakRepo, updateData, user);

      const breakRecord = await this.prisonerBreakRepo.findOne({ where: { prisonerBreakId: dto.prisonerBreakId } });
      
      if(breakRecord){
           await this.dynamicService.updateTableData(queryRunner, PriPrisonerKey, this.prisonerKeyRepo, {
                prisonerKeyId: breakRecord.prisonerKeyId,
                wfmStatusId: 17861 
            }, user);

            const prisonerKey = await this.prisonerKeyRepo.findOne({ where: { prisonerKeyId: breakRecord.prisonerKeyId } });
            if(prisonerKey){
                await this.dynamicService.updateTableData(queryRunner, PriPrisoner, this.prisonerRepo, {
                    prisonerId: prisonerKey.prisonerId,
                    wfmStatusId: 17861
                }, user);
            }
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const updateData = {
            prisonerBreakId: id,
            isActive: 0,
            deleted: user.id || user.userId
        };
        
        await this.dynamicService.updateTableData(queryRunner, PriPrisonerBreak, this.prisonerBreakRepo, updateData, user);
        
        await queryRunner.commitTransaction();
    } catch (err) {
        console.error('PriPrisonerBreakService.delete ERROR:', err);
        await queryRunner.rollbackTransaction();
        throw new HttpException(err, 500);
    } finally {
      await queryRunner.release();
    }
  }
}

