import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriPrisonerAccountBookValidationDto } from 'src/dto/validation/pri/prisoner/account.book.dto';
import { PriPrisonerAccountBook } from 'src/entity/pri/prisoner/priPrisonerAccountBook';
import { PriPrisonerAccountBookView } from 'src/entity/pri/prisoner/priPrisonerAccountBookView';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilter } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PriPrisonerAccountBookService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriPrisonerAccountBook)
    private accountBookRepo: Repository<PriPrisonerAccountBook>,
    @InjectRepository(PriPrisonerAccountBookView)
    private accountBookViewRepo: Repository<PriPrisonerAccountBookView>,
    private readonly dynamicService: DynamicService,
  ) {}

  //#region [LIST]
  
  async list(options: IPaginationOptions, searchParam) {
    const filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('ab', filterVals)
    }

    const queryBuilder = this.accountBookViewRepo.createQueryBuilder('ab')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('ab.createdDate', 'DESC')
    const data = await paginate<PriPrisonerAccountBookView>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  //#endregion

  //#region [CRUD]
  
  async createAndUpdate(dto: PriPrisonerAccountBookValidationDto, user: any) {
    return dto.bookId
      ? this.update(dto, user)
      : this.create(dto, user);
  }

  async create(dto: PriPrisonerAccountBookValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newData = Object.assign(dto, {
        bookId: await getId(),
        debitAmount: dto.debitAmount ? dto.debitAmount : 0,
        creditAmount: dto.creditAmount ? dto.creditAmount : 0,
        createdDate: new Date(),
        createdEmployeeKeyId: user.employeeKey.employeeKeyId,
      });
      await this.dynamicService.createTableData(queryRunner, PriPrisonerAccountBook, this.accountBookRepo, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async update(dto: PriPrisonerAccountBookValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await queryRunner.manager.findOne(PriPrisonerAccountBook, {
        where: { bookId: dto.bookId },
      });
      if (!found) {
        throw new BadRequestException(`Бүртгэл олдсонгүй!`)
      }
      const updateData = dto;
      await this.dynamicService.updateTableData(queryRunner, PriPrisonerAccountBook, this.accountBookRepo, updateData, user)
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
      await this.dynamicService.deleteHardTableData(queryRunner, this.accountBookRepo, id)
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

