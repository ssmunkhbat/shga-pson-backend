import { WfmStatus } from "src/entity/wfmStatus.entity";
import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_ROTL_VIEW')
export class PriRotlView {

  @ViewColumn({ name: 'ROTL_ID' })
  rotlId: string;

  @ViewColumn({ name: 'PERSON_ID' })
  personId: number;

  @ViewColumn({ name: 'PRISONER_ID' })
  prisonerId: number;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'PRISONER_NUMBER' })
  prisonerNumber: string;

  @ViewColumn({ name: 'STATE_REG_NUMBER'})
  stateRegNumber: string;

  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'LAST_NAME' })
  lastName: string;

  @ViewColumn({ name: 'ROTL_TYPE_ID' })
  rotlTypeId: number;

  @ViewColumn({ name: 'ROTL_TYPE_NAME' })
  rotlTypeName: string;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @OneToOne(() => WfmStatus, (ws) => ws.wfmStatusId)
  @JoinColumn({name: 'WFM_STATUS_ID'})
  wfmStatus: WfmStatus;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @ViewColumn({ name: 'ADMINISTRATIVE_DECISION_ID' })
  administrativeDecisionId: number;

  @ViewColumn({ name: 'ADMINISTRATIVE_DECISION_NUMBER' })
  administrativeDecisionNumber: string;

  @ViewColumn({ name: 'DECISION_TYPE_NAME' })
  decisionTypeName: string;

  @ViewColumn({ name: 'LEAVE_DATE' })
  leaveDate: Date;

  @ViewColumn({ name: 'ARRIVE_DATE' })
  arriveDate: Date;

  @ViewColumn({ name: 'RECEIVED_DATE' })
  receivedDate: Date;

  @ViewColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @ViewColumn({ name: 'OFFICER_ID' })
  officerId: number;

  @ViewColumn({ name: 'OFFICER_NAME' })
  officerName: string;

  @ViewColumn({ name: 'OFFICER_PHONE' })
  officerPhone: string;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'EMPLOYEE_CODE' })
  employeeCode: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  static getTableFields() {
    return {
      prisonerNumber: { header: 'Хоригдогчийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-16' },
      stateRegNumber: { header: 'Регистрийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      firstName: { header: 'Өөрийн нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      lastName: { header: 'Эцэг/эх-ийн нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      administrativeDecisionNumber: { header: 'Шийдвэрийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      // decisionTypeName: { header: 'Шийдвэрийн төрөл', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      leaveDate: { header: 'Явсан огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' },
      arriveDate: { header: 'Ирэх огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' },
      receivedDate: { header: 'Ирсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' },
      wfmStatus: {
        header: 'Төлөв',
        type: 'refstatus',
        refField: 'wfmStatus.wfmStatusName', refListName: 'wfmStatusList', refListFilter: 'filters=[{"field":"WFM_STATUS_GROUP_ID","value":100600}]',
        refColorField: 'wfmStatus.wfmStatusColor', refBgColorField: 'wfmStatus.wfmStatusBgColor',
        sortable: false, filterable: true, width: 'w-16'
      },
      rotlTypeName: { header: 'Төрөл', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      // officerName: { header: 'Авч явсан албан хаагч', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      // officerPhone: { header: 'Авч явсан а.х утас', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      employeeCode: { header: 'Бүртгэсэн ажилтан код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Үүсгэсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' }
    }
  }
}