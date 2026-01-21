
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriNotificationMView } from 'src/entity/pri/notification/priNotificationMView';
import { getPermissionData, getPermissionFilter } from 'src/utils/permission-helper';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
      @InjectRepository(PriNotificationMView)
      private notifRepository: Repository<PriNotificationMView>,
  ) {}
  
  async getList(user: any) {
    const { departmentId } = await getPermissionData(user);
    const where = await getPermissionFilter(departmentId, 'n', 'departmentId');
    const queryBuilder = this.notifRepository.createQueryBuilder('n');
    if (user.userId !== 1 && where) {
      queryBuilder.where(where);
    }
    const data = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();
    return { rows: data, count };
  }
}
