import { WfmStatus } from "src/entity/wfmStatus.entity";
import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_LEAVE_VIEW')
export class LeaveView {

  @ViewColumn({ name: 'LEAVE_ID' })
  leaveId: string;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'PRISONER_NUMBER' })
  prisonerNumber: string;

  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'LAST_NAME' })
  lastName: string;

  @ViewColumn({ name: 'LEAVE_TYPE_ID' })
  leaveTypeId: number;

  @ViewColumn({ name: 'LEAVE_TYPE_NAME' })
  leaveTypeName: string;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @OneToOne(() => WfmStatus, (ws) => ws.wfmStatusId)
  @JoinColumn({name: 'WFM_STATUS_ID'})
  wfmStatus: WfmStatus;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @ViewColumn({ name: 'DECISION_ID' })
  decisionId: number;

  @ViewColumn({ name: 'DECISION_NUMBER' })
  decisionNumber: string;

  @ViewColumn({ name: 'DECISION_TYPE_NAME' })
  decisionTypeName: string;

  @ViewColumn({ name: 'LEAVE_DATE' })
  leaveDate: Date;

  @ViewColumn({ name: 'ARRIVE_DATE' })
  arriveDate: Date;

  @ViewColumn({ name: 'RECEIVED_DATE' })
  receivedDate: Date;

  @ViewColumn({ name: 'OFFICER_ID' })
  officerId: number;
  
  @ViewColumn({ name: 'OFFICER_NAME' })
  officerName: string;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'OFFICER_PHONE' })
  officerPhone: string;

  @ViewColumn({ name: 'EMPLOYEE_CODE' })
  employeeCode: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  static getTableFields() {
    return {
      prisonerNumber: { header: 'Хоригдогчийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      firstName: { header: 'Өөрийн нэр', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      lastName: { header: 'Эцэг/эх-ийн нэр', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      leaveTypeName: { header: 'Төрөл', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      wfmStatus: {
        header: 'Төлөв',
        type: 'refstatus',
        refField: 'wfmStatus.wfmStatusName', refListName: 'wfmStatusList', refListFilter: 'filters=[{"field":"WFM_STATUS_GROUP_ID","value":100500}]',
        refColorField: 'wfmStatus.wfmStatusColor', refBgColorField: 'wfmStatus.wfmStatusBgColor',
        sortable: false, filterable: true, width: 'w-16'
      },
      decisionNumber: { header: 'Шийдвэрийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      decisionTypeName: { header: 'Шийдвэрийн төрөл', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      leaveDate: { header: 'Явсан огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-72' },
      arriveDate: { header: 'Ирэх огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-72' },
      receivedDate: { header: 'Ирсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-72' },
      officerName: { header: 'Авч явсан албан хаагч', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      officerPhone: { header: 'Авч явсан а.х утас', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      employeeCode: { header: 'Бүртгэсэн ажилтан код', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      createdDate: { header: 'Үүсгэсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-72' }
    }
  }
}