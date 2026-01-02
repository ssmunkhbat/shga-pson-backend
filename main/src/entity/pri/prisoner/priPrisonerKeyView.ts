import { Column, ViewEntity } from 'typeorm';

@ViewEntity('PRI_PRISONER_KEY_VIEW')
export class PriPrisonerKeyView {
  @Column({ name: "AGE" })
  age: string;

  @Column({ name: "BEGIN_DATE", default: new Date() })
  beginDate: Date;

  @Column({ name: "CASE_NUMBER" })
  caseNumber: string;

  @Column({ name: "CELL_NUMBER" })
  cellNumber: string;

  @Column({ name: "CLOSED_DATE", default: new Date() })
  closedDate: Date;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  @Column({ name: "CREATED_EMPLOYEE_KEY_ID" })
  createdEmployeeKeyId: number;

  @Column({ name: "DECISION_DATE", default: new Date() })
  decisionDate: Date;

  @Column({ name: "DECISION_EMPLOYEE_NAME" })
  decisionEmployeeName: string;

  @Column({ name: "DECISION_ID" })
  decisionId: number;

  @Column({ name: "DECISION_NUMBER" })
  decisionNumber: string;

  @Column({ name: "DECISION_TYPE_ID" })
  decisionTypeId: number;

  @Column({ name: "DECISION_TYPE_NAME" })
  decisionTypeName: string;

  @Column({ name: "DEPARTMENT_ID" })
  departmentId: number;

  @Column({ name: "DEPARTMENT_NAME" })
  departmentName: string;

  @Column({ name: "DEPARTMENT_REGIME_ID" })
  departmentRegimeId: number;

  @Column({ name: "DEPARTMENT_TYPE_ID" })
  departmentTypeId: number;

  @Column({ name: "DEPARTMENT_TYPE_NAME" })
  departmentTypeName: string;

  @Column({ name: "DETENTION_ID" })
  detentionId: number;

  @Column({ name: "END_DATE", default: new Date() })
  endDate: Date;

  @Column({ name: "FAMILY_NAME" })
  familyName: string;

  @Column({ name: "FIRST_NAME" })
  firstName: string;

  @Column({ name: "IS_LAST" })
  isLast: boolean;

  @Column({ name: "IS_RECIDIVIST" })
  isRecidivist: boolean;

  @Column({ name: "LAST_NAME" })
  lastName: string;

  @Column({ name: "LAW_ACT_CODE" })
  lastActCode: string;

  @Column({ name: "LAW_ACT_CODE2" })
  lawActCode2: string;

  @Column({ name: "NICKNAME" })
  nickname: string;

  @Column({ name: "PARENT_DEPARTMENT_ID" })
  parentDepartmentId: number;

  @Column({ name: "PERSON_ID" })
  personId: number;

  @Column({ name: "PICTURE_PATH" })
  picturePath: string;

  @Column({ name: "PRISONER_ID" })
  prisonerId: number;

  @Column({ name: "PRISONER_KEY_ID" })
  prisonerKeyId: number;

  @Column({ name: "PRISONER_NUMBER" })
  prisonerNumber: string;

  @Column({ name: "REGIME_CLASS_NAME" })
  regimeClassName: string;

  @Column({ name: "REGIME_NAME" })
  regimeName: string;

  @Column({ name: "SENTENCE_CNT" })
  sentenceCnt: string;

  @Column({ name: "STATE_REG_NUMBER" })
  stateRegNumber: string;

  @Column({ name: "WFM_STATUS_ID" })
  wfmStatusId: number;

  @Column({ name: "WFM_STATUS_NAME" })
  wfmStatusName: string;

  constructor(item: Partial<PriPrisonerKeyView>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      prisonerId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      prisonerNumber: { header: 'Хоригдогчийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      stateRegNumber: { header: 'Регистрийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
    };
  }
}