import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PriAddressValidationDto } from 'src/dto/validation/pri/address.dto';
import { PriAddress } from 'src/entity/pri/address/priAddress';
import { DynamicService } from 'src/modules/dynamic/dynamic.service';
import { getFilter } from 'src/utils/helper';
import { getId } from 'src/utils/unique';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PriAddressService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(PriAddress)
    private addressRepo: Repository<PriAddress>,
    private readonly dynamicService: DynamicService,
  ) {}

  //#region [LIST]
  
  async list(options: IPaginationOptions, searchParam) {
    const filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('addr', filterVals)
    }

    const queryBuilder = this.addressRepo.createQueryBuilder('addr')
      .leftJoinAndSelect("addr.addressType", "addressType")
      .leftJoinAndSelect("addr.aimag", "aimag")
      .leftJoinAndSelect("addr.soum", "soum")
      .leftJoinAndSelect("addr.bag", "bag")
      .leftJoinAndSelect("addr.country", "country")
    
    if (filter) queryBuilder.andWhere(filter)
    // queryBuilder.orderBy('addr.createdDate', 'DESC')
    const data = await paginate<PriAddress>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  //#endregion

  //#region [CRUD]
  
  async createAndUpdate(dto: PriAddressValidationDto, user: any) {
    return dto.addressId
      ? this.update(dto, user)
      : this.create(dto, user);
  }

  async create(dto: PriAddressValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newData = Object.assign(dto, {
        addressId: await getId(),
      });
      await this.dynamicService.createTableData(queryRunner, PriAddress, this.addressRepo, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async update(dto: PriAddressValidationDto, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await this.addressRepo.findOne({ where: { addressId: dto.addressId } });
      if (found) {
        throw new BadRequestException(`Бүртгэл олдсонгүй!`)
      }
      const updateData = dto;
      await this.dynamicService.updateTableData(queryRunner, PriAddress, this.addressRepo, updateData, user)
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
      await this.dynamicService.deleteHardTableData(queryRunner, this.addressRepo, id)
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

