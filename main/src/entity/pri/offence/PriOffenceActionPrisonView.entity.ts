import { WfmStatus } from "src/entity/wfmStatus.entity";
import { JoinColumn, OneToOne, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_OFFENCE_ACTION_VIEW')
export class PriOffenceActionPrisonView {
  @ViewColumn({ name: 'OFFENCE_ID' })
  offenceId: number;

  @ViewColumn({ name: 'OFFENCE_ACTION_ID' })
  offenceActionId: number;

  @ViewColumn({ name: 'ADMINISTRATIVE_DECISION_ID' })
  administrativeDecisionId: number;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'PRISONER_BONUS_DAY_ID' })
  prisonerBonusDayId: number;

  @ViewColumn({ name: 'DISCIPLINE_CELL_BOOK_ID' })
  disciplineCellBookId: number;

  @ViewColumn({ name: 'PRISONER_LABOR_ID' })
  prisonerLaborId: number;

  @ViewColumn({ name: 'OFFENCE_ACTION_TYPE_ID' })
  offenceActionTypeId: number;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @OneToOne(() => WfmStatus, (ws) => ws.wfmStatusId)
  @JoinColumn({name: 'WFM_STATUS_ID'})
  wfmStatus: WfmStatus;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'UPDATED_DATE' })
  updatedDate: Date;

  @ViewColumn({ name: 'UPDATED_EMPLOYEE_KEY_ID' })
  updatedEmployeeKeyId: number;

  @ViewColumn({ name: 'CANCELLED_STATUS_ID' })
  cancelledStatusId: number;

  @ViewColumn({ name: 'OFFENCE_TYPE_ID' })
  offenceTypeId: number;

  @ViewColumn({ name: 'OFFENCE_TYPE_NAME' })
  offenceTypeName: string;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'OFFENCE_DATE' })
  offenceDate: Date;

  @ViewColumn({ name: 'ADMINISTRATIVE_DECISION_NUMBER' })
  administrativeDecisionNumber: string;

  @ViewColumn({ name: 'DECISION_DATE' })
  decisionDate: Date;

  @ViewColumn({ name: 'OFFENCE_ACTION_TYPE_NAME' })
  offenceActionTypeName: string;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @ViewColumn({ name: 'CANCELLED_STATUS_NAME' })
  cancelledStatusName: string;

  @ViewColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'PRISONER_ID' })
  prisonerId: number;

  @ViewColumn({ name: 'PRISONER_NUMBER' })
  prisonerNumber: string;

  @ViewColumn({ name: 'NICKNAME' })
  nickname: string;

  @ViewColumn({ name: 'PERSON_ID' })
  personId: number;

  @ViewColumn({ name: 'REGISTER' })
  register: string;

  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'LAST_NAME' })
  lastName: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;

  @ViewColumn({ name: 'UPDATED_EMPLOYEE_NAME' })
  updatedEmployeeName: string;

  static getTableFields() {
    return {
      offenceTypeName: { header: 'Зөрчлийн төрөл', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      offenceDate: { header: 'Зөрчил гаргасан огноо', type: 'date', sortable: true, filterable: true, width: 'w-48' },
      offenceActionTypeName: { header: 'Шийтгэлийн төрөл', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      administrativeDecisionNumber: { header: 'Тушаалын дугаар', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      decisionDate: { header: 'Тушаалын огноо', type: 'date', sortable: true, filterable: true, width: 'w-48' },
      wfmStatusName: { header: 'Төлөв', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      cancelledStatusName: { header: 'Цуцалсан шалтгаан', type: 'string', sortable: true, filterable: true, width: 'w-48' }
    }
  }
}