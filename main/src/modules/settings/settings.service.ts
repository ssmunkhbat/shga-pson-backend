import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { MenuMetaDto } from 'src/dto/menuMetaDto';
import { MenuDto } from 'src/dto/menuDto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  //#region [MENU]

  async getMenu(user: any) {
    const roleIds = await this.getRoleIds(user.userId)
    const list = await this.getMenuFull(roleIds)
    return list;
  }

  async getMenuFull(roleIds: any) {
    if (roleIds.length === 0) return []
    const menus = await this.getTopMenu(roleIds);
    const list = []
    for (const item of menus.slice(0)) {
      const found = list.find(a => a.trgMetaDataId === item.trgMetaDataId)
      if (!found) {
        item.children = await this.getSubMenu(item.trgMetaDataId, roleIds)
        list.push(item)
      }
    }

    // const list = [
    //   ...new Map(menus.map(item => [item.trgMetaDataId, item])).values(),
    // ];

    return list;
    // const result = list.reduce((acc, item) => {
    //   acc.push(...item.children)
    //   return acc
    // }, [])
    // return result
  }

  async getTopMenu(roleIds: []) {
    const query = `
      SELECT
        DISTINCT MM.TRG_META_DATA_ID,
        UMP.PERMISSION_ID AS PERMISSION_ID,
        MD.META_DATA_NAME AS TRG_META_DATA_NAME,
        'fa fa-folder icon-state-warning' AS ICON,
        MD.META_TYPE_ID,
        MM.ORDER_NUM
      FROM META_META_MAP MM
      INNER JOIN META_DATA MD ON MD.META_DATA_ID = MM.TRG_META_DATA_ID 
      ${roleIds.some(a => a === 100) ? 'LEFT' : 'INNER'} JOIN UM_META_PERMISSION UMP ON MD.META_DATA_ID = UMP.META_DATA_ID AND UMP.ROLE_ID IN (${roleIds})
      WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = 144601542339575
      ORDER BY MM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const rows: MenuMetaDto[] = plainToClass(
      MenuMetaDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return rows
  }

  async getSubMenu(metaDataId: number, roleIds: []) {
    const query = `
      SELECT
        DISTINCT MM.TRG_META_DATA_ID,
        UMP.PERMISSION_ID AS PERMISSION_ID,
        MD.META_DATA_NAME AS TRG_META_DATA_NAME,
        'fa fa-folder icon-state-warning' AS ICON,
        MD.META_TYPE_ID,
        MM.ORDER_NUM
      FROM META_META_MAP MM
      INNER JOIN META_DATA MD ON MD.META_DATA_ID = MM.TRG_META_DATA_ID 
      LEFT JOIN UM_META_PERMISSION UMP ON MD.META_DATA_ID = UMP.META_DATA_ID AND UMP.ROLE_ID IN (${roleIds})
      WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = ${metaDataId}  
      ORDER BY MM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const rows: MenuMetaDto[] = plainToClass(
      MenuMetaDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    const list = [
      ...new Map(rows.map(item => [item.trgMetaDataId, item])).values(),
    ];
    for (const item of list) {
      item.children = await this.getSubMenu(item.trgMetaDataId, roleIds);
    }
    return list
  }

  async getRoleIds(user_id: number) {
    const query = `
      SELECT ROLE_ID FROM UM_USER_ROLE WHERE USER_ID = ${user_id} AND IS_ACTIVE = 1
    `;
    const result = await this.dataSource.query(query);
    return result.map(item => item.ROLE_ID);
  }

  async getDefaultMenu(user: any) {
    console.log('---------getDefaultMenu---------')
    const query = `
      SELECT
        DISTINCT MM.TRG_META_DATA_ID ID
        , MM.TRG_META_DATA_ID META_DATA_ID
        , MD.META_DATA_CODE CODE
        , MD.META_DATA_NAME NAME
        , MM.ORDER_NUM
      FROM META_META_MAP MM
      INNER JOIN META_DATA MD ON MD.META_DATA_ID = MM.TRG_META_DATA_ID 
      INNER JOIN UM_META_PERMISSION UMP ON MD.META_DATA_ID = UMP.META_DATA_ID
      WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = 144601542339575
      GROUP BY MM.TRG_META_DATA_ID, MD.META_DATA_CODE, MD.META_DATA_NAME, MM.ORDER_NUM
      ORDER BY MM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const rows: MenuDto[] = plainToClass(
      MenuDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    const list = []
    for (const item of rows.slice(0)) {
      console.log('---------getDefaultSubMenu------item---', item)
      const found = list.find(a => a.metaDataId === item.metaDataId)
      if (!found) {
        item.children = await this.getDefaultSubMenu(item.metaDataId)
        list.push(item)
      }
    }
    console.log('---------getDefaultMenu------list---', list)
    return list
  }
  async getDefaultSubMenu(metaDataId: number, level = 1, maxLevel = 2) {
    if (level > maxLevel) return []; // 3 түвшнээс дээш давж болохгүй
    console.log('---------getDefaultSubMenu------metaDataId---', metaDataId)
    const query = `
      SELECT DISTINCT MM.TRG_META_DATA_ID ID
        , MM.TRG_META_DATA_ID META_DATA_ID
        , MD.META_DATA_CODE CODE
        , MD.META_DATA_NAME NAME
        , MM.ORDER_NUM
      FROM META_META_MAP MM
      INNER JOIN META_DATA MD ON MD.META_DATA_ID = MM.TRG_META_DATA_ID 
      INNER JOIN UM_META_PERMISSION UMP ON MD.META_DATA_ID = UMP.META_DATA_ID 
      WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = ${metaDataId}
      GROUP BY MM.TRG_META_DATA_ID, MD.META_DATA_CODE, MD.META_DATA_NAME, MM.ORDER_NUM
      ORDER BY MM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const rows: MenuDto[] = plainToClass(
      MenuDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    const list = [
      ...new Map(rows.map(item => [item.metaDataId, item])).values(),
    ];
    for (const item of list) {
      item.children = await this.getDefaultSubMenu(item.metaDataId, level + 1, maxLevel);
    }
    return list
  }

  //#endregion

}

