import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PriPrisonerKeyView } from 'src/entity/pri/prisoner/priPrisonerKeyView';
import { UmSystemUser } from 'src/entity/um/um-system-user.entity';
import { MovementDeparture } from 'src/entity/pri/movement/movementDeparture.entity';
import { MovementArrival } from 'src/entity/pri/movement/movementArrival.entity';
import { PriEmployeeKey } from 'src/entity/pri/employee/priEmployeeKey';
import { PriAdministrativeDecision } from 'src/entity/pri/administrative/priAdministrativeDecision';
import { UmRole } from 'src/entity/um/umRole';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { PriPrisonerAccountBook } from 'src/entity/pri/prisoner/priPrisonerAccountBook';
import { PriPrisonerAccountBookView } from 'src/entity/pri/prisoner/priPrisonerAccountBookView';
import { ActionSettingsDto } from 'src/dto/settings/action.dto';
import { plainToClass } from '@nestjs/class-transformer';

interface TableFieldMeta {
  header: string;
  type: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
}

type TableFields = Record<string, TableFieldMeta>;
type DynamicTable = { getTableFields(): TableFields };

const dynamicTables: Record<string, DynamicTable> = {
  'role': UmRole as unknown as DynamicTable,
  'user': UmSystemUser as unknown as DynamicTable,
  'pkw': PriPrisonerKeyView as unknown as DynamicTable,
  'employeeKey': PriEmployeeKey as unknown as DynamicTable,
  'movement-departure': MovementDeparture as unknown as DynamicTable,
  'movement-arrival': MovementArrival as unknown as DynamicTable,
  'decision': PriAdministrativeDecision as unknown as DynamicTable,
  'account-book': PriPrisonerAccountBook as unknown as DynamicTable,
  'account-book-view': PriPrisonerAccountBookView as unknown as DynamicTable,
};

@Injectable()
export class TableConfigService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) { }

  getColumns(entityName: string) {
    if (!dynamicTables[entityName]) {
      throw new Error('Not found');
    }
    const fields = dynamicTables[entityName].getTableFields();
    if (!fields) {
      throw new Error('Not found');
    }
    const columns = Object.entries(fields).map(([key, meta]) => ({
      key,
      header: meta.header,
      type: meta.type,
      sortable: meta.sortable,
      filterable: meta.filterable,
      width: meta.width,
    }));
    return columns;
  }

  async getList(
    tableKey: string,
    query: { page?: number; limit?: number; search?: string },
  ) {
    const entity = dynamicTables[tableKey];
    if (!entity) {
      throw new NotFoundException(`Table "${tableKey}" not found`);
    }

    const repository: Repository<any> = this.dataSource.getRepository(entity as any);

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    let qb: SelectQueryBuilder<any> = repository.createQueryBuilder(tableKey);
    let filters: Array<{ field: string; value: any; type: string }> = [];
    if (query.search) {
      try {
        filters = JSON.parse(query.search);
      } catch (e) {
        throw new BadRequestException('Invalid filter format');
      }
    }
    filters.forEach((f, index) => {
      const paramName = `filter_${index}`;
      if (f.type === 'string') {
        qb.andWhere(`${tableKey}.${f.field} LIKE :${paramName}`, { [paramName]: `%${f.value}%` });
      } else if (f.type === 'number') {
        qb.andWhere(`${tableKey}.${f.field} = :${paramName}`, { [paramName]: f.value });
      } else if (f.type === 'date') {
        qb.andWhere(`${tableKey}.${f.field} = :${paramName}`, { [paramName]: new Date(f.value) });
      } else {
        qb.andWhere(`${tableKey}.${f.field} LIKE :${paramName}`, { [paramName]: `%${f.value}%` });
      }
    });
    // const [sql, params] = qb.getQueryAndParameters();
    // console.log('Generated SQL:', sql);
    // console.log('Parameters:', params);

    const [items, total] = await qb.skip(skip).take(limit).getManyAndCount();

    return {
      rows: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  //#region [MENU]

  async getActionsByPath(url: string, user: any) {
    const query = `
      SELECT ID, META_DATA_ID FROM pri_settings_menu WHERE path = '${url}'
    `;
    const result = await this.dataSource.query(query);
    if (result.length === 0) return []
    // return await this.getActions(result[0].META_DATA_ID, user)
    return await this.getActions(result[0].ID, user)
  }

  // async getActions(metaDataId: number, user: any) {
  //   console.log('------getActions----metaDataId---', metaDataId)
  //   console.log('------getActions----roleId---', user.userRole.roleId)
  //   const childList = await this.getChildMetaDataId(metaDataId);
  //   const query = `
  //     SELECT
  //       DISTINCT pd.PROCESS_META_DATA_ID AS TRG_META_DATA_ID,
  //       UMP.PERMISSION_ID AS PERMISSION_ID,
  //       PD.PROCESS_NAME AS TRG_META_DATA_NAME,
  //       'fa ' || pd.ICON_NAME AS ICON,
  //       PMD.META_TYPE_ID
  //     FROM META_DM_PROCESS_DTL PD
  //     LEFT JOIN META_DATA PMD ON pd.PROCESS_META_DATA_ID = PMD.META_DATA_ID
  //     LEFT JOIN UM_META_PERMISSION UMP ON PMD.META_DATA_ID = UMP.META_DATA_ID AND UMP.ROLE_ID = ${user.userRole.roleId}
  //     WHERE PD.MAIN_META_DATA_ID = ${childList.length > 0 ? childList[0].TRG_META_DATA_ID : metaDataId}
  //   `;
  //   const result = await this.dataSource.query(query);
  //   console.log('------getActions----result---', result)
  //   return result.map((item: any) => {
  //     return { id: item.PERMISSION_ID, name: item.TRG_META_DATA_NAME, metaDataId: item.TRG_META_DATA_ID, icon: item.ICON, }
  //   })
  // }
  async getActions(menuId: number, user: any) {
    if (!menuId) return []
    const queryAction = `
      SELECT
        *
      FROM PRI_SETTINGS_ACTION SA
      WHERE SA.MENU_ID = ${menuId}
    `;
    const result = await this.dataSource.query(queryAction);
    const rows: ActionSettingsDto[] = plainToClass(
      ActionSettingsDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return rows;
  }

  async getChildMetaDataId(metaDataId: number) {
    const query = `
      SELECT
        DISTINCT ML.ACTION_META_DATA_ID AS TRG_META_DATA_ID,
        NVL(MGL.LIST_NAME, AMD.META_DATA_NAME) AS TRG_META_DATA_NAME,
        'fa fa-list icon-state-warning' AS ICON,
        AMD.META_TYPE_ID,
        999999 AS ORDER_NUM
      FROM META_MENU_LINK ML
        LEFT JOIN META_DATA AMD ON ML.ACTION_META_DATA_ID = AMD.META_DATA_ID
        LEFT JOIN META_GROUP_LINK MGL ON ML.ACTION_META_DATA_ID = MGL.META_DATA_ID
      WHERE ML.META_DATA_ID = ${metaDataId}
        AND ML.ACTION_META_DATA_ID IS NOT NULL 
        AND ML.ACTION_META_DATA_ID NOT IN ( 
          SELECT 
            DISTINCT MMM.ACTION_META_DATA_ID 
          FROM META_META_MAP MM
            INNER JOIN META_MENU_LINK MMM ON MMM.META_DATA_ID = MM.TRG_META_DATA_ID 
          WHERE MM.SRC_META_DATA_ID = ${metaDataId}
        )
    `;
    let result = []
    result = await this.dataSource.query(query);
    if (result.length === 0) {
      const query2 = `
        SELECT WEB_URL FROM META_MENU_LINK WHERE META_DATA_ID = 1456201997392;
      `;
      const result2 = await this.dataSource.query(query2);
      if (result2.length > 0) {
        const parsedMetaDataId = await this.getMetaDataIdFromUrl(result2[0].WEB_URL)
        result = await this.getChildMetaDataId(parsedMetaDataId);
      }
    }
    return result
  }
  getMetaDataIdFromUrl(url) {
    if (!url) return;
    // const url = 'mdobject/dataview/144705286748736?dv[wfmStatusId]=100101&title=Баривчлагдсан+этгээд';
    const match = url.match(/dataview\/(\d+)/);
    const id = match ? match[1] : null;
    console.log(id);
    return id;
  }

  //#endregion

}
