
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriNotificationMView } from 'src/entity/pri/notification/priNotificationMView';
import { getPermissionData, getPermissionFilter } from 'src/utils/permission-helper';
import { Repository, Brackets } from 'typeorm';
import { PriMovementDeparturePack } from 'src/entity/pri/movement/PriMovementDeparturePack';

@Injectable()
export class NotificationService {
  constructor(
      @InjectRepository(PriNotificationMView)
      private notifRepository: Repository<PriNotificationMView>,
      @InjectRepository(PriMovementDeparturePack)
      private departurePackRepo: Repository<PriMovementDeparturePack>,
  ) {}
  
  async getList(user: any) {
    const notifications: any[] = [];
    
    
    if (user?.employeeKey?.departmentId) {
        console.log('---Noti-----: Searching for movements to Dept:', user.employeeKey.departmentId);
        const enRouteMovements = await this.departurePackRepo.createQueryBuilder('dp')
            .leftJoinAndSelect('dp.fromDepartment', 'fd', 'fd.departmentId = dp.fromDepartmentId')
            .leftJoinAndSelect('dp.toDepartment', 'td', 'td.departmentId = dp.toDepartmentId')
            .where(new Brackets(qb => {
                qb.where('dp.toDepartmentId = :deptId', { deptId: user.employeeKey.departmentId })
                  .orWhere('dp.fromDepartmentId = :deptId', { deptId: user.employeeKey.departmentId });
            }))
            .andWhere('dp.wfmStatusId = :status', { status: 100302 })
            .orderBy('dp.departureDate', 'DESC')
            .getMany();
        
        console.log('---Noti-----::', enRouteMovements.length);
        
        for (const mov of enRouteMovements) {
            let typeLabel = "Шилжилт";
            let bgClass = "bg-yellow-50"; 

            if (mov.movementTypeId === 1) {
                typeLabel = "Хуяглан хүргэх";
                bgClass = "bg-purple-50";
            } else if (mov.movementTypeId === 2) {
                typeLabel = "Эмнэлэг яаралтай";
                bgClass = "bg-red-50";
            }

            notifications.push({
                notifId: `mov_${mov.movementDeparturePackId}`,
                txt: `(${typeLabel}) ${mov.fromDepartment?.name || 'Unknown'} -> ${mov.toDepartment?.name || 'Unknown'}, ${mov.numberOfPrisoners || 0} хоригдол`,
                type: 'movement',
                movementTypeId: mov.movementTypeId,
                className: bgClass, 
                dateText: mov.departureDate ? new Date(mov.departureDate).toISOString().split('T')[0] : '', 
                isRead: false 
            });
        }
    }

    const { departmentId } = await getPermissionData(user);
    const where = await getPermissionFilter(departmentId, 'n', 'departmentId');
    const queryBuilder = this.notifRepository.createQueryBuilder('n');
    if (user.userId !== 1 && where) {
      queryBuilder.where(where);
    }
    const data = await queryBuilder.getMany();
    
    const existingNotifs = data.map(n => ({
        notifId: n.notifId,
        txt: n.txt, 
        type: n.type || 'system',
        className: 'bg-gray-50',
        dateText: n.dateText,
        isRead: true 
    }));

    const finalRows = [...notifications, ...existingNotifs];

    return { rows: finalRows, count: finalRows.length };
  }
}
