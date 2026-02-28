import { Expose } from '@nestjs/class-transformer';

export class NotificationDto {

    @Expose({ name: 'NOTIF_ID' })
    notifId: number;

    @Expose({ name: 'DEPARTMENT_ID' })
    departmentId: number;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;

    @Expose({ name: 'TYPE' })
    type: string;

    @Expose({ name: 'TXT' })
    txt: string;

    @Expose({ name: 'DATE_TEXT' })
    dateText: Date;
}