import { Injectable, NotFoundException, BadRequestException, HttpException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { RefDto } from 'src/dto/refDto';
import { DataSource } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { getId } from 'src/utils/unique';
import { CacheService } from 'src/modules/cache/cache.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { getFilterAndParameters, getSortFieldAndOrder } from 'src/utils/helper';
import { TableConfigService } from 'src/modules/table-config/table-config.service';
import { isNumeric } from 'src/utils/helper';

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
  'psActionList': 'PRI_SETTINGS_ACTION',
  'leaveTypeList': 'PRI_INFO_LEAVE_TYPE',
  'laborTypeList': 'PRI_INFO_LABOR_TYPE',
  'laborResultTypeList': 'PRI_INFO_LABOR_RESULT_TYPE',
  'wfmStatusList': 'WFM_STATUS',
  'rotlTypeList': 'PRI_INFO_ROTL_TYPE',
  'infoTrainingList': 'PRI_INFO_TRAINING',
  'releaseTypeList': 'PRI_INFO_RELEASE_TYPE',
};

const notCheckIsActive = {
  'transactionTypeList': 'PRI_INFO_TRANSACTION_TYPE',
}

export const refList = [
  {
    key: 'psMenuList', name: 'Цэс', entity: 'PRI_SETTINGS_MENU',
    tableIdField: 'id', tableColumnService: '/table-config/columns/psMenuList', listService: '/refs/column-list/data/psMenuList'
  },
  {
    key: 'psActionList', name: 'Цэсний үйлдэл', entity: 'PRI_SETTINGS_ACTION',
    tableIdField: 'id', tableColumnService: '/table-config/columns/psActionList', listService: '/refs/column-list/data/psActionList'
  },
  {
    key: 'countryList', name: 'Улс', entity: 'REF_COUNTRY',
    tableIdField: 'countryId', tableColumnService: '/table-config/columns/countryList', listService: '/refs/column-list/data/countryList'
  },
  {
    key: 'wfmStatusList', name: 'Төлөв', entity: 'WFM_STATUS',
    tableIdField: 'wfmStatusId', tableColumnService: '/table-config/columns/wfmStatusList', listService: '/refs/column-list/data/wfmStatusList'
  },
];

@Injectable()
export class RefsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private readonly cacheService: CacheService,
    private readonly tableConfigService: TableConfigService,
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
          customFilter += `${customFilter ? ' AND ' : ''}${field} = ${
            typeof value === 'string' ? `'${value}'` : value
          }`;
        }
      });
    }

    if (!notCheckIsActive[refName]) {
      customFilter += `${customFilter ? ' AND ' : ''}is_active = 1`;
    }

    let query = `SELECT * FROM ${mapRef[refName]}`;
    if (customFilter) {
      query += ` WHERE ${customFilter}`;
    }

    if (refName === 'departmentListMove') {
      query = `
        SELECT *
        FROM ${mapRef[refName]}
        WHERE ${customFilter}
          AND (DEPARTMENT_TYPE_ID IN (2, 3)
          OR (DEPARTMENT_REGIME_ID = 3 AND SHOW_ON_INQUIRY = 0))
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
    if (!mapRef[refName]) {
      throw new NotFoundException('Reference not found');
    }
    const entityName = mapRef[refName]
    const repository = this.dataSource.getRepository(entityName);
    const queryBuilder = repository.createQueryBuilder(entityName.toLowerCase());

    // if (entityName === 'PriDecisionView') {
    //   queryBuilder.leftJoin("dec.decisionType", "DT").addSelect(['DT.decisionTypeId', 'DT.code', 'DT.name']);
    // }

    const { filter, parameters } = getFilterAndParameters(entityName.toLowerCase(), searchParam);
    if (filter) {
      queryBuilder.where(filter, parameters);
    }

    // const { field, order } = getSortFieldAndOrder(entityName.toLowerCase(), sortParam);
    // if (field) {
    //   queryBuilder.orderBy(field, order);
    // } else {
    //   queryBuilder.orderBy(`${entityName.toLowerCase()}.createdDate`, 'DESC');
    // }

    const data = await paginate(queryBuilder, options);
    return { rows: data.items, total: data.meta.totalItems };
  }

  async saveRefDynamic(dto: any, user: any) {
    const { refName, id, ...data } = dto;

    const EntityClass = mapRef[refName];
    if (!EntityClass) {
      throw new NotFoundException('Reference not found');
    }
    const fields = this.tableConfigService.getFormFields(refName);
    this.validateDynamicDto(data, fields);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let entity;

      if (id) {
        entity = await queryRunner.manager.findOne(EntityClass, {
          where: { id },
        });
        if (!entity) {
          throw new NotFoundException('Өгөгдөл олдсонгүй');
        }

        const allowedKeys = fields.map(f => f.key);
        Object.entries(data).forEach(([key, value]) => {
          if (allowedKeys.includes(key)) {
            entity[key] = value;
          }
        });

        if ('modifiedDate' in entity) entity.modifiedDate = new Date();
        if ('modifiedUserId' in entity) entity.modifiedUserId = user?.userId;
      } else {
        const allowedData: any = {};
        const allowedKeys = fields.map(f => f.key);
        Object.entries(data).forEach(([key, value]) => {
          if (allowedKeys.includes(key)) {
            const foundKey = fields.find(f => f.key === key);
            if (foundKey) {
              if (foundKey.type === 'number') {
                allowedData[key] = Number(value);
              } else {
                allowedData[key] = value;
              }
            }
          }
        });

        const primary = fields.find(f => f.isPrimary);
        if (primary) {
          allowedData[primary.key] = id || await getId();
        }

        entity = queryRunner.manager.create(EntityClass, allowedData);
        
        if ('createdDate' in entity) entity.createdDate = new Date();
        if ('createdUserId' in entity) entity.createdUserId = user?.userId;
      }
      const saved = await queryRunner.manager.save(EntityClass, entity);

      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  validateDynamicDto(data: any, fields: any) {
    const errors: string[] = [];
    Object.entries(fields).forEach(([key, config]: any) => {
      const value = data[config.key || key];
      if (config.isRequired && (value === undefined || value === null || value === '')) {
        errors.push(`${config.key} шаардлагатай`);
      }
      if (config.type === 'string' && value && typeof value !== 'string') {
        errors.push(`${config.key} string байх ёстой`);
      }
      if (config.type === 'number' && value && !isNumeric(value)) {
        errors.push(`${config.key} number байх ёстой`);
      }
    });
    console.log('--errors--:', errors);
    if (errors.length) {
      throw new BadRequestException(errors);
    }
  }

  async removeRefDynamic(dto: any, user: any) {
    const { refName, id, primaryField } = dto;
    if (!refName || !id || !primaryField) {
      throw new NotFoundException('refName эсвэл id, primaryField утга шаардана!');
    }

    const EntityClass = mapRef[refName];
    if (!EntityClass) {
      throw new NotFoundException('Reference not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let entity;

      if (id) {
        entity = await queryRunner.manager.findOne(EntityClass, {
          where: { [primaryField]: id },
        });
        if (!entity) {
          throw new NotFoundException('Өгөгдөл олдсонгүй');
        }

        entity.isActive = false;
      }
      const saved = await queryRunner.manager.save(EntityClass, entity);

      await queryRunner.commitTransaction();
      return saved;
    } catch (err) {
      console.log(err)
      await queryRunner.rollbackTransaction();
      throw new HttpException(err, 500)
    } finally {
      await queryRunner.release();
    }
  }

  async restoreRefDynamic(dto: any, user: any) {
    const { refName, id, primaryField } = dto;
    if (!refName || !id || !primaryField) {
      throw new NotFoundException('refName эсвэл id, primaryField утга шаардана!');
    }

    const EntityClass = mapRef[refName];
    if (!EntityClass) {
      throw new NotFoundException('Reference not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let entity;

      if (id) {
        entity = await queryRunner.manager.findOne(EntityClass, {
          where: { [primaryField]: id },
        });
        if (!entity) {
          throw new NotFoundException('Өгөгдөл олдсонгүй');
        }

        entity.isActive = true;
      }
      const saved = await queryRunner.manager.save(EntityClass, entity);

      await queryRunner.commitTransaction();
      return saved;
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
