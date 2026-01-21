
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriNotificationMView } from 'src/entity/pri/notification/priNotificationMView';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
      @InjectRepository(PriNotificationMView)
      private notifRepository: Repository<PriNotificationMView>,
  ) {}
  
  async getList(user: any) {
    const queryBuilder = this.notifRepository.createQueryBuilder('n')
    const data = await queryBuilder.getMany();
    const count = await queryBuilder.getCount();
    return { rows: data, count };
  }
}
