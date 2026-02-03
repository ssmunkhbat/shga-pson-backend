import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_LEAVE_VIEW')
export class LeaveView {
  @ViewColumn({ name: 'PRISONER_NUMBER' })
  prisonerNumber: string;

  static getTableFields() {
    return {
      prisonerNumber: { header: 'Хоригдогчийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-72' },
    }
  }
}