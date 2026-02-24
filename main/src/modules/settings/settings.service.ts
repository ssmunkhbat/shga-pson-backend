import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { plainToClass } from '@nestjs/class-transformer';
import { MenuMetaDto } from 'src/dto/menuMetaDto';
import { MenuSettingsDto } from 'src/dto/settings/menu.dto';
import { ActionSettingsDto } from 'src/dto/settings/action.dto';
import { RoleMenuSettings } from 'src/entity/pri/settings/RoleMenuSettings';
import { RoleActionSettings } from 'src/entity/pri/settings/RoleActionSettings';
import { CacheService } from '../cache/cache.service';
import { SaveMenuSettingsDto } from 'src/dto/settings/saveMenuSettings.dto';
import { getId } from 'src/utils/unique';

@Injectable()
export class SettingsService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(RoleMenuSettings)
    private roleMenuRepository: Repository<RoleMenuSettings>,
    
    @InjectRepository(RoleActionSettings)
    private roleActionRepository: Repository<RoleActionSettings>,
    private readonly cacheService: CacheService,
  ) {}

  //#region [MANAIH]

  async getMenuList(user: any, isAction: boolean = false) {
    let joinStr = '';
    let whereStr = '';
    if (!isAction) {
      joinStr = ' INNER JOIN PRI_SETTINGS_ROLE_MENU RM ON SM.ID = RM.MENU_ID';
      whereStr = ` AND RM.ROLE_ID = ${user.userRole.roleId} `;
    }
    const query = `
      SELECT
        *
      FROM PRI_SETTINGS_MENU SM
      ${joinStr}
      WHERE SM.TYPE = 'sub' AND SM.IS_ACTIVE = 1 AND (SM.PARENT_ID != 10878524 OR SM.PARENT_ID IS NULL)
      ${whereStr}
      ORDER BY SM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const rows: MenuSettingsDto[] = plainToClass(
      MenuSettingsDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    const list = []
    for (const item of rows) {
      const queryChildren = `
        SELECT
          *
        FROM PRI_SETTINGS_MENU SM
        ${joinStr}
        WHERE SM.TYPE = 'list' AND SM.IS_ACTIVE = 1 AND SM.PARENT_ID = ${item.id}
        ${whereStr}
        ORDER BY SM.ORDER_NUM ASC
      `;
      const resultChildren = await this.dataSource.query(queryChildren);
      const data: MenuSettingsDto[] = plainToClass(
        MenuSettingsDto,
        resultChildren as object[],
        { excludeExtraneousValues: true },
      );
      if (isAction) {
        for (const sItem of data) {
          sItem.actions = await this.getMenuAction(sItem.id);
          // "Цахим хувийн хэрэг" гэх мэт LINKED_MENU_ID-тэй action-уудад
          for (const action of sItem.actions) {
            if (action.linkedMenuId) {
              action.linkedMenu = await this.getPageMenuTree(action.linkedMenuId);
            }
          }
        }
      }
      item.children = data
      item.actions = await this.getMenuAction(item.id);
      list.push(item)
    }
    return list
  }
  async getMenuAction(menuId: number) {
    if (!menuId) return []
    const queryAction = `
      SELECT * FROM PRI_SETTINGS_ACTION SA
      WHERE SA.MENU_ID = ${menuId}
    `;
    const result = await this.dataSource.query(queryAction);
    const rows: ActionSettingsDto[] = plainToClass(
      ActionSettingsDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return rows
  }

  // page -> section -> section
  async getPageMenuTree(menuId: number): Promise<MenuSettingsDto | null> {
    if (!menuId) return null;
    const query = `SELECT * FROM PRI_SETTINGS_MENU SM WHERE SM.ID = ${menuId} AND SM.IS_ACTIVE = 1`;
    const result = await this.dataSource.query(query);
    if (!result || result.length === 0) return null;
    const menu: MenuSettingsDto = plainToClass(MenuSettingsDto, result[0] as object, {
      excludeExtraneousValues: true,
    });
    menu.children = await this.getSectionChildren(menu.id);
    menu.actions = await this.getMenuAction(menu.id);
    return menu;
  }
  // section-уудыг авах
  async getSectionChildren(parentId: number): Promise<MenuSettingsDto[]> {
    if (!parentId) return [];
    const query = `
      SELECT *
      FROM PRI_SETTINGS_MENU SM
      WHERE SM.PARENT_ID = ${parentId}
        AND SM.TYPE = 'section'
        AND SM.IS_ACTIVE = 1
      ORDER BY SM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const sections: MenuSettingsDto[] = plainToClass(MenuSettingsDto, result as object[], {
      excludeExtraneousValues: true,
    });
    for (const section of sections) {
      section.children = await this.getSectionChildren(section.id);
      section.actions = await this.getMenuAction(section.id);
    }
    return sections;
  }
  
  async getMenuTree(roleId: number, user: any) {
    const [treeData, roleMenuSettings] = await Promise.all([
      this.getMenuList(user, true),
      this.getRoleMenuSettings(roleId),
    ]);
    return { treeData, roleMenuSettings }
    // const treeData = await this.getMenuList(user, true);
    // console.log('---------treeData---------', treeData)
    // return { treeData }
  }

  async getRoleMenuSettings(roleId: number): Promise<any> {
    // Menu IDs татах
    const menuSettings = await this.roleMenuRepository.find({
      where: { roleId, isActive: 1 },
      select: ['menuId'],
    });

    const menuIds = menuSettings.map(m => m.menuId);

    // Action IDs татах
    const actionSettings = await this.roleActionRepository.find({
      where: { roleId, isActive: 1 },
      select: ['menuId', 'actionId'],
      order: { menuId: 'ASC', actionId: 'ASC' },
    });

    // Actions-г menuId-р багцлана
    const actionMap: { [key: number]: number[] } = {};
    actionSettings.forEach(item => {
      if (!actionMap[item.menuId]) {
        actionMap[item.menuId] = [];
      }
      actionMap[item.menuId].push(item.actionId);
    });

    return {
      defaultSelectedMenu: menuIds,
      defaultSelectedAction: actionMap,
    };
  }

  //#region [SAVE ROLE MENU & ACTION SETTINGS]

  async saveRoleMenuSettings(dto: SaveMenuSettingsDto, user: any): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Өмнөх menus устгах
      await queryRunner.manager.delete(RoleMenuSettings, {
        roleId: dto.roleId,
      });

      // Шинэ menus оруулах
      if (dto.menuIds.length > 0) {
        const menuEntities = dto.menuIds.map(menuId => {
          const entity = new RoleMenuSettings();
          entity.id = getId();
          entity.roleId = dto.roleId;
          entity.menuId = menuId;
          entity.createdUserId = user.userId;
          return entity;
        });

        await queryRunner.manager.save(menuEntities);
      }

      // Өмнөх actions устгах
      await queryRunner.manager.delete(RoleActionSettings, {
        roleId: dto.roleId,
      });

      // Шинэ actions оруулах
      const actionEntities = [];
      for (const [menuId, actionIds] of Object.entries(dto.actions)) {
        for (const actionId of actionIds) {
          const entity = new RoleActionSettings();
          entity.id = getId();
          entity.roleId = dto.roleId;
          entity.menuId = parseInt(menuId);
          entity.actionId = actionId;
          entity.createdUserId = user.userId;
          actionEntities.push(entity);
        }
      }

      if (actionEntities.length > 0) {
        await queryRunner.manager.save(actionEntities);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  //#endregion

  //#endregion

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
    const rows: MenuSettingsDto[] = plainToClass(
      MenuSettingsDto,
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
    const rows: MenuSettingsDto[] = plainToClass(
      MenuSettingsDto,
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
  async getMenuAndAction(roleId: number, user: any) {
    console.log('---------getMenuAndAction-----roleId----', roleId)
    // const all = await this.getMenuAndActionData(null, user);
    // const selected = await this.getMenuAndActionData(roleId, user);
    // return selected;
    const [treeData, roleMenuSettings] = await Promise.all([
      this.getMenuAndActionData(null, user),
      this.getRoleMenuSettings(roleId),
    ]);
    return { treeData, roleMenuSettings };
  }
  async getMenuAndActionData(roleId: number | null, user: any) {
    const treeCacheKey = `menu-tree`;
    if (!roleId) {
      const cachedData = await this.cacheService.getCache(treeCacheKey);
      if (cachedData) {
        // return { treeData: cachedData };
        return cachedData;
      }
    }

    const rows = await this.getMenuTop(roleId, !roleId);
    let list = []
    for (const item of rows.slice(0)) {
      const found = list.find(a => a.metaDataId === item.metaDataId)
      if (!found) {
        console.log('---------getMenuAndActionData-----item.metaDataId----', item.metaDataId)
        // item.children = await this.getMASubMenu(item.metaDataId, roleId);
        // list.push(item);
        const children = await this.getMASubMenu(item.metaDataId, roleId);
        list = list.concat(children);
      }
    }
    if (!roleId) await this.cacheService.setCache(treeCacheKey, list);
    // return { treeData: list };
    return list;
  }
  async getMenuTop(roleId: number, isAll: boolean = false) {
    let filter = '';
    if (!isAll) {
      filter = ` AND UMP.ROLE_ID = ${roleId} `
    }
    console.log('---------getMenuTop-----roleId----', roleId)
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
      WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = 144601542339575 AND MM.TRG_META_DATA_ID != 144603119577370 
      ${filter}
      GROUP BY MM.TRG_META_DATA_ID, MD.META_DATA_CODE, MD.META_DATA_NAME, MM.ORDER_NUM
      ORDER BY MM.ORDER_NUM ASC
    `;
    // WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = 144601542339575 and MM.TRG_META_DATA_ID = 144620193692987
    const result = await this.dataSource.query(query);
    const rows: MenuSettingsDto[] = plainToClass(
      MenuSettingsDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return rows;
  }
  async getMASubMenu(metaDataId: number, roleId: number, level = 1, maxLevel = 2) {
    if (level > maxLevel) return []; // 3 түвшнээс дээш давж болохгүй
    let filter = '';
    if (roleId) {
      filter = ` AND UMP.ROLE_ID = ${roleId} `
    }
    const query = `
      SELECT DISTINCT MM.TRG_META_DATA_ID ID
        , MM.TRG_META_DATA_ID META_DATA_ID
        , MD.META_DATA_CODE CODE
        , MD.META_DATA_NAME NAME
        , MM.ORDER_NUM
      FROM META_META_MAP MM
      INNER JOIN META_DATA MD ON MD.META_DATA_ID = MM.TRG_META_DATA_ID 
      INNER JOIN UM_META_PERMISSION UMP ON MD.META_DATA_ID = UMP.META_DATA_ID ${filter} 
      WHERE MD.IS_ACTIVE = 1 AND MM.SRC_META_DATA_ID = ${metaDataId}
      GROUP BY MM.TRG_META_DATA_ID, MD.META_DATA_CODE, MD.META_DATA_NAME, MM.ORDER_NUM
      ORDER BY MM.ORDER_NUM ASC
    `;
    const result = await this.dataSource.query(query);
    const rows: MenuSettingsDto[] = plainToClass(
      MenuSettingsDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    const list = [
      ...new Map(rows.map(item => [item.metaDataId, item])).values(),
    ];
    for (const item of list) {
      item.children = await this.getMASubMenu(item.metaDataId, roleId, level + 1, maxLevel);
      item.actions = await this.getAction(item.metaDataId, roleId);
    }
    return list
  }
  async getAction(metaDataId: number, roleId: number = 102) {
    if (!metaDataId) return []
    const queryMenuLink = `
      SELECT *
      FROM META_MENU_LINK 
      WHERE meta_data_id = ${metaDataId}
    `;
    const resultMenuLink = await this.dataSource.query(queryMenuLink);
    if (resultMenuLink.length === 0) return []

    const queryAction = `
      SELECT
        DISTINCT pd.PROCESS_META_DATA_ID AS ID
        , PD.PROCESS_NAME AS NAME
        , 'fa ' || pd.ICON_NAME AS ICON
        , PD.ORDER_NUM AS ORDER_NUM
      FROM META_DM_PROCESS_DTL PD
      LEFT JOIN META_DATA PMD ON pd.PROCESS_META_DATA_ID = PMD.META_DATA_ID
      LEFT JOIN UM_META_PERMISSION UMP ON PMD.META_DATA_ID = UMP.META_DATA_ID AND UMP.ROLE_ID = ${roleId}
      WHERE PD.MAIN_META_DATA_ID = ${resultMenuLink[0].ACTION_META_DATA_ID}
    `;
    const result = await this.dataSource.query(queryAction);
    const rows: ActionSettingsDto[] = plainToClass(
      ActionSettingsDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return rows
  }

  //#endregion

}

