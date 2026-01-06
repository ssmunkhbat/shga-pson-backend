import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { getId } from 'src/utils/unique';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilter } from 'src/utils/helper';
import { UmRole } from 'src/entity/um/umRole';
import { DynamicService } from '../dynamic/dynamic.service';

const mapRef = {
  'settings-role-list': 'UM_ROLE',
};

@Injectable()
export class RoleService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly dynamicService: DynamicService,
    @InjectRepository(UmRole)
    private roleRepo: Repository<UmRole>,
  ) {}

  async getList(options: IPaginationOptions, searchParam, user: any) {
    let filterVals = JSON.parse(searchParam)
    let filter = null
    if (filterVals) {
      filter = getFilter('r', filterVals)
    }
    const queryBuilder = this.roleRepo.createQueryBuilder('r')
      .where('r.isActive = 1')
    
    if (filter) queryBuilder.andWhere(filter)
    queryBuilder.orderBy('r.createdDate', 'DESC');
    const data = await paginate<UmRole>(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems }
  }

  async create(body: any, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tableName = 'UmRole';
      const repoName = 'UmRole';
      const found = await this.roleRepo.findOne({ where: { roleName: body.roleName.trim(), isActive: true } });
      if(found) {
        throw new BadRequestException(`${body.roleName} -нэртэй дүр өмнө нь бүртгэгдсэн байна!`)
      }
      const newData = {
        roleId: await getId(),
        roleCode: body.roleCode,
        roleName: body.roleName,
        isActive: true,
        createdUserId: user.userId,
        createdDate: new Date(),
      };
		  await this.dynamicService.createTableData(queryRunner, tableName, repoName, newData, user)
      await queryRunner.commitTransaction();
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async update(body: any, user: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const tableName = 'UmRole';
      const repoName = 'UmRole';
		  await this.dynamicService.createTableData(queryRunner, tableName, repoName, body, user)
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
