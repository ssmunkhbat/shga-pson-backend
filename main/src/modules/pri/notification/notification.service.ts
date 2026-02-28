
import { Injectable } from '@nestjs/common';
import { InjectDataSource ,InjectRepository } from '@nestjs/typeorm';
import { PriNotificationMView } from 'src/entity/pri/notification/priNotificationMView';
import { getPermissionData, getPermissionFilter } from 'src/utils/permission-helper';
import { Repository, Brackets, DataSource } from 'typeorm';
import { PriMovementDeparturePack } from 'src/entity/pri/movement/PriMovementDeparturePack';
import { NotificationDto } from 'src/dto/pri/notification/notification.dto'
import { plainToClass } from '@nestjs/class-transformer';

@Injectable()
export class NotificationService {
  constructor(
      @InjectDataSource() private dataSource: DataSource,
      @InjectRepository(PriNotificationMView)
      private notifRepository: Repository<PriNotificationMView>,
      @InjectRepository(PriMovementDeparturePack)
      private departurePackRepo: Repository<PriMovementDeparturePack>,
  ) {}
  
  async getList(user: any, type: string) {
    const notifications: any[] = [];

    // if (user?.employeeKey?.departmentId) {
    //     console.log('---Noti-----: Searching for movements to Dept:', user.employeeKey.departmentId);
    //     const enRouteMovements = await this.departurePackRepo.createQueryBuilder('dp')
    //         .leftJoinAndSelect('dp.fromDepartment', 'fd', 'fd.departmentId = dp.fromDepartmentId')
    //         .leftJoinAndSelect('dp.toDepartment', 'td', 'td.departmentId = dp.toDepartmentId')
    //         .where(new Brackets(qb => {
    //             qb.where('dp.toDepartmentId = :deptId', { deptId: user.employeeKey.departmentId })
    //               .orWhere('dp.fromDepartmentId = :deptId', { deptId: user.employeeKey.departmentId });
    //         }))
    //         .andWhere('dp.wfmStatusId = :status', { status: 100302 })
    //         .orderBy('dp.departureDate', 'DESC')
    //         .getMany();
        
    //     console.log('---Noti-----::', enRouteMovements.length);
        
    //     for (const mov of enRouteMovements) {
    //         let typeLabel = "Шилжилт";
    //         let bgClass = "bg-yellow-50"; 

    //         if (mov.movementTypeId === 1) {
    //             typeLabel = "Хуяглан хүргэх";
    //             bgClass = "bg-purple-50";
    //         } else if (mov.movementTypeId === 2) {
    //             typeLabel = "Эмнэлэг яаралтай";
    //             bgClass = "bg-red-50";
    //         }

    //         notifications.push({
    //             notifId: `mov_${mov.movementDeparturePackId}`,
    //             txt: `(${typeLabel}) ${mov.fromDepartment?.name || 'Unknown'} -> ${mov.toDepartment?.name || 'Unknown'}, ${mov.numberOfPrisoners || 0} хоригдол`,
    //             type: 'movement',
    //             movementTypeId: mov.movementTypeId,
    //             className: bgClass, 
    //             dateText: mov.departureDate ? new Date(mov.departureDate).toISOString().split('T')[0] : '', 
    //             isRead: false 
    //         });
    //     }
    // }

    // const { departmentId } = await getPermissionData(user);
    // const where = await getPermissionFilter(departmentId, 'n', 'departmentId');
    // const queryBuilder = this.notifRepository.createQueryBuilder('n');
    // if (user.userId !== 1 && where) {
    //   queryBuilder.where(where);
    // }
    // const data = await queryBuilder.getMany();
    // const existingNotifs = data.map(n => ({
    //     notifId: n.notifId,
    //     txt: n.txt, 
    //     type: n.type || 'system',
    //     className: 'bg-gray-50',
    //     dateText: n.dateText,
    //     isRead: true 
    // }));

    // const finalRows = [...notifications, ...existingNotifs];
    // return { rows: finalRows, count: finalRows.length };

    const queryMap: Record<string, string> = {
      tsagdan: `
        SELECT
          PRISONER_KEY_ID AS NOTIF_ID,
          DEPARTMENT_ID,
          DEPARTMENT_NAME,
          'tsagdan' AS TYPE,
          DEPARTMENT_NAME || ':' || STATE_REG_NUMBER || 
          ' регистрийн дугаартай ' || LAST_NAME || 
          ' овогтой ' || FIRST_NAME AS TXT,
          TO_CHAR(remaining_days) AS DATE_TEXT
        FROM PRI_TSAGDAN_TIME_VIEW
      `,
      movement: `
        SELECT
          movement_arrival_pack_id AS NOTIF_ID,
          TO_DEPARTMENT_ID DEPARTMENT_ID,
          TO_DEPARTMENT_NAME DEPARTMENT_NAME,
          'movement' AS TYPE,
          FROM_DEPARTMENT_NAME || '-с ' || 
          TO_DEPARTMENT_NAME || ' руу ' || 
          NUMBER_OF_PRISONERS || ' хоригдогч ' AS TXT,
          TO_CHAR(DEPARTURE_DATE, 'yyyy-mm-dd HH24:mi') AS DATE_TEXT
        FROM PRI_MOVEMENT_ARRIVAL_PACK_VIEW
        WHERE WFM_STATUS_ID = 100302 AND MOVEMENT_TYPE_ID = 1
      `,
      hunger: `
        SELECT
          PRISONER_KEY_ID AS NOTIF_ID,
          DEPARTMENT_ID,
          DEPARTMENT_NAME,
          'hunger' AS TYPE,
          DEPARTMENT_NAME || ':' || STATE_REG_NUMBER || 
          ' регистрийн дугаартай ' || LAST_NAME || 
          ' овогтой ' || FIRST_NAME AS TXT,
          TO_CHAR(BEGIN_DATE, 'yyyy-mm-dd HH24:mi') AS DATE_TEXT
        FROM PRI_HUNGER_MARCH2_VIEW
      `,
      offence_action: `
        SELECT
          OFFENCE_ACTION_ID AS NOTIF_ID,
          DEPARTMENT_ID,
          DEPARTMENT_NAME,
          'offence_action' AS TYPE,
          DEPARTMENT_NAME || ':' || REGISTER || 
          ' регистрийн дугаартай ' || LAST_NAME || 
          ' овогтой ' || FIRST_NAME AS TXT,
          TO_CHAR(OFFENCE_DATE, 'yyyy-mm-dd HH24:mi') AS DATE_TEXT
        FROM PRI_OFFENCE_ACTION_VIEW
        WHERE WFM_STATUS_ID = 100801 AND OFFENCE_ACTION_TYPE_ID = 2
      `,
      rotl: `
        SELECT
          ROTL_ID AS NOTIF_ID,
          DEPARTMENT_ID,
          NULL DEPARTMENT_NAME,
          'rotl' AS TYPE,
          ROTL_TYPE_NAME || ':' || STATE_REG_NUMBER || 
          ' регистрийн дугаартай ' || LAST_NAME || 
          ' овогтой ' || FIRST_NAME AS TXT,
          TO_CHAR(TRUNC(TO_DATE(ARRIVE_DATE,'YYYY-MM-DD') -
          TO_DATE(LEAVE_DATE,'YYYY-MM-DD'))) AS DATE_TEXT
        FROM PRI_ROTL_VIEW
        WHERE WFM_STATUS_ID = 100601
      `,
      jail_time: `
        SELECT
          PRISONER_ID AS NOTIF_ID,
          DEPARTMENT_ID,
          NAME DEPARTMENT_NAME,
          'jail_time' AS TYPE,
          NAME || ':' || STATE_REG_NUMBER || 
          ' регистрийн дугаартай ' || LAST_NAME || 
          ' овогтой ' || FIRST_NAME AS TXT,
          TO_CHAR(REMAINING_DAYS) AS DATE_TEXT
        FROM PRI_PRISONER_JAIL_TIME_VIEW
      `,
    };

    if (!queryMap[type]) {
      return { rows: [], count: 0 };
    }

    const result = await this.dataSource.query(queryMap[type]);
    const rows: NotificationDto[] = plainToClass(
      NotificationDto,
      result as object[],
      { excludeExtraneousValues: true },
    );
    return { rows, count: rows.length };
  }
}
