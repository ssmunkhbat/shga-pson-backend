import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity('PRI_RELEASE_VIEW')
export class PriReleaseView {
  @ViewColumn({ name: 'RELEASE_ID' })
  releaseId: number;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'DECISION_ID' })
  decisionId: number;

  @ViewColumn({ name: 'RELEASE_TYPE_ID' })
  releaseTypeId: number;

  @ViewColumn({ name: 'RELEASE_DATE' })
  releaseDate: Date;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'IS_ROLLEDBACK' })
  isRolledback: number;

  @ViewColumn({ name: 'ROLLEDBACK_DATE' })
  rolledbackDate: Date;

  @ViewColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @ViewColumn({ name: 'PRISONER_ID' })
  prisonerId: number;

  @ViewColumn({ name: 'PRISONER_NUMBER' })
  prisonerNumber: string;

  @ViewColumn({ name: 'STATE_REG_NUMBER' })
  stateRegNumber: string;

  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'LAST_NAME' })
  lastName: string;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'RELEASE_TYPE_NAME' })
  releaseTypeName: string;

  @ViewColumn({ name: 'DECISION_NUMBER' })
  decisionNumber: string;

  @ViewColumn({ name: 'PERSON_ID' })
  personId: number;

  @ViewColumn({ name: 'DETENTION_ID' })
  detentionId: number;

  static getTableFields() {
    return {
      releaseDate: { header: 'Хасагдсан огноо', type: 'date', sortable: true, filterable: true, width: 120 },
      createdDate: { header: 'Үүсгэсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 140 },
      prisonerNumber: { header: 'Хоригдогчийн дугаар', type: 'text', sortable: true, filterable: true, width: 140 },
      stateRegNumber: { header: 'Регистрийн дугаар', type: 'text', sortable: true, filterable: true, width: 130 },
      firstName: { header: 'Өөрийн нэр', type: 'text', sortable: true, filterable: true, width: 130 },
      lastName: { header: 'Эцэг/Эх -ийн нэр', type: 'text', sortable: true, filterable: true, width: 130 },
      departmentName: { header: 'Хаанаас', type: 'text', sortable: true, filterable: true, width: 200 },
      releaseTypeName: { header: 'Хасагдсан төрөл', type: 'text', sortable: true, filterable: true, width: 150 },
      decisionNumber: { header: 'Шийдвэрийн дугаар', type: 'text', sortable: true, filterable: true, width: 150 },
      isRolledback: { header: 'Буцаасан эсэх', type: 'boolean', sortable: true, filterable: true, width: 120 },
      rolledbackDate: { header: 'Буцаасан огноо', type: 'datetime', sortable: true, filterable: true, width: 130 },
    };
  }

  constructor(item: Partial<PriReleaseView>) {
    Object.assign(this, item)
  }
}
