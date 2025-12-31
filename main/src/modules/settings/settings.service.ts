import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { MenuDto } from 'src/dto/menuDto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async getMenu(user: any) {
    const roleIds = await this.getRoleIds(user.userId)
    console.log('-------getMenuTop------roleIds-----', roleIds);
    if (roleIds.length === 0) return []
    const menus = await this.getTopMenu(roleIds);
    const list = []
    for (const item of menus) {
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
      INNER JOIN UM_META_PERMISSION UMP ON MD.META_DATA_ID = UMP.META_DATA_ID AND UMP.ROLE_ID IN (${roleIds})
      WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = 144601542339575
      ORDER BY MM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const rows: MenuDto[] = plainToClass(
      MenuDto,
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
    const rows: MenuDto[] = plainToClass(
      MenuDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    const list = [
      ...new Map(rows.map(item => [item.trgMetaDataId, item])).values(),
    ];
    return list
  }

  async getRoleIds(user_id: number) {
    const query = `
      SELECT ROLE_ID FROM UM_USER_ROLE WHERE USER_ID = ${user_id} AND IS_ACTIVE = 1
    `;
    const result = await this.dataSource.query(query);
    return result.map(item => item.ROLE_ID);
  }

}

