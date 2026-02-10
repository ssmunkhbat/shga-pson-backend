import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RefDto } from 'src/dto/refDto';
import { DataSource } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { getId } from 'src/utils/unique';
import { CacheService } from '../cache/cache.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';

const mapRef = {
  'role': 'UM_ROLE',
  'mt-prisoner': 'PRI_MOVEMENT_TYPE_PRISONER',
  'departmentList': 'PRI_INFO_DEPARTMENT',
  'departmentListMove': 'PRI_INFO_DEPARTMENT',
  'regimen': 'PRI_INFO_DEPARTMENT_REGIME',
  'regimenClass': 'PRI_INFO_DEP_REGIME_CLASS',
  'countryList': 'REF_COUNTRY',
  'nationalityList': 'PRI_INFO_NATIONALITY',
  'aimagCityList': 'PRI_INFO_AIMAG_CITY',
  'soumDistrictList': 'PRI_INFO_SOUM_DISTRICT',
  'bagKhorooList': 'PRI_INFO_BAG_KHOROO',
  'educationList': 'PRI_INFO_EDUCATION',
  'addressTypeList': 'PRI_INFO_ADDRESS_TYPE',
  'transactionTypeList': 'PRI_INFO_TRANSACTION_TYPE',
  'bookTypeList': 'PRI_INFO_BOOK_TYPE',
  'decisionTypeList': 'PRI_INFO_DECISION_TYPE',
  'psMenuList': 'PRI_SETTINGS_MENU',
  'leaveTypeList': 'PRI_INFO_LEAVE_TYPE',
  'labor-type': 'PRI_INFO_LABOR_TYPE',
  'labor-result-type': 'PRI_INFO_LABOR_RESULT_TYPE',
};

const notCheckIsActive = {
  'transactionTypeList': 'PRI_INFO_TRANSACTION_TYPE',
}

export const refList = [
  { key: 'psMenuList', name: 'Цэс', entity: 'PRI_SETTINGS_MENU', tableIdField: 'id', tableColumnService: '/table-config/columns/psMenuList', listService: '/refs/column-list/data/psMenuList' },
];

@Injectable()
export class RefsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly cacheService: CacheService,
  ) {}

  //#region [MAIN]

  async getList(refName: string, rawFilters: string) {
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }

    // if (await this.cacheService.isChanged(refName)) {
    //   const data = await this.refreshList(refName, rawFilters);
    //   await this.cacheService.resetChanged(refName);
    //   return data;
    // }

    // const cachedData = await this.cacheService.getCache(refName);
    // if (cachedData) {
    //   return cachedData;
    // }
    return await this.refreshList(refName, rawFilters);
  }

  private async refreshList(refName: string, rawFilters: string) {
    let customFilter = '';
    if (rawFilters) {
      const filters = JSON.parse(rawFilters);
      filters.forEach(({ field, value }) => {
        if (value !== undefined && value !== null) {
          customFilter += ` AND ${field} = ${
            typeof value === 'string' ? `'${value}'` : value
          }`;
        }
      });
    }

    if (!notCheckIsActive[refName]) customFilter += 'is_active = 1 '

    let query = `SELECT * FROM ${mapRef[refName]}`;

    if (customFilter !== '') query += ` where ${customFilter}`

    if (refName === 'departmentListMove') {
       query = `
      SELECT *
      FROM ${mapRef[refName]}
      WHERE ${customFilter} AND (DEPARTMENT_TYPE_ID IN (2, 3) OR (DEPARTMENT_REGIME_ID = 3 AND SHOW_ON_INQUIRY = 0))
    `;
    }

    const result = await this.dataSource.query(query);

    await this.cacheService.setCache(refName, result);

    return plainToClass(RefDto, result, {
      excludeExtraneousValues: true
    });
  }

  async createRef(refName: string, data) {
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }

    await this.cacheService.markAsChanged(refName);
    const newData = {
      id: await getId(),
      name: data.name,
      isActive: data.isActive,
      sortDefault: Number(data.sortDefault),
    };
    return this.dataSource
      .createQueryBuilder()
      .insert()
      .into(mapRef[refName])
      .values([newData])
      .execute();
  }

  async updateRef(refName: string, id: number, data) {
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }
    await this.cacheService.markAsChanged(refName);
    return this.dataSource
      .createQueryBuilder()
      .update(mapRef[refName])
      .set({
        name: data.name,
        isActive: data.isActive,
        sortDefault: data.sortDefault,
      })
      .where('id = :id', { id })
      .execute();
  }

  async getListById(id: number, tableName: string, columnName: string) {
    if (!id || (id && !mapRef[tableName])) {
      throw new NotFoundException('id not found');
    }
    const query = `
      SELECT *
      FROM ${mapRef[tableName]}
      WHERE is_active = 1 AND ${columnName} = ${id}
    `;
    const result = await this.dataSource.query(query);
    return plainToClass(RefDto, result, {
      excludeExtraneousValues: true
    });
    return []
  }

  //#endregion

  //#region [/admin/ref/page]

  async getRefColumnList(refName: string, rawFilters: string) {
    return refList;
  }
    
  async getRefColumnListData (options: IPaginationOptions, searchParam: string, sortParam: string, user: any, refName) {
    console.log("getRefColumnList -> refName:", refName);
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }
    const entityName = mapRef[refName]
    console.log("getRefColumnList -> entityName:", entityName);
    const repository = this.dataSource.getRepository(entityName);
    const queryBuilder = repository.createQueryBuilder(entityName.toLowerCase());

    // if (entityName === 'PriDecisionView') {
    //   queryBuilder.leftJoin("dec.decisionType", "DT").addSelect(['DT.decisionTypeId', 'DT.code', 'DT.name']);
    // }

    const { filter, parameters } = getFilterAndParameters(entityName.toLowerCase(), searchParam);
    if (filter) {
      queryBuilder.where(filter, parameters);
    }

    const { field, order } = getSortFieldAndOrder(entityName.toLowerCase(), sortParam);
    if (field) {
      queryBuilder.orderBy(field, order);
    } else {
      queryBuilder.orderBy(`${entityName.toLowerCase()}.createdDate`, 'DESC');
    }

    const data = await paginate(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems };
  }

  //#endregion

}
