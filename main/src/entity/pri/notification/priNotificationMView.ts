import { Column, ViewEntity } from 'typeorm';

@ViewEntity('PRI_NOTIFICATION_MVIEW')
export class PriNotificationMView {

  @Column({ name: "NOTIF_ID" })
  notifId: number;

  @Column({ name: "TYPE" })
  type: string;

  @Column({ name: "TXT" })
  txt: number;

  @Column({ name: "DATE_TEXT" })
  dateText: string;

  constructor(item: Partial<PriNotificationMView>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      // notifId: { header: 'ID', type: 'string', sortable: false, filterable: true, width: 'w-24' },
      type: { header: 'Төрөл', type: 'string', sortable: false, filterable: true, width: 'w-24' },
      dateTxt: { header: 'Огноо', type: 'date', sortable: false, filterable: true, width: 'w-24' },
      txt: { header: 'Текст', type: 'string', sortable: false, filterable: true, width: 'w-24' },
    };
  }
}