import { Column,  PrimaryGeneratedColumn, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_OFFENCE_VIEW')
export class PriOffenceView {

  @ViewColumn({ name: 'OFFENCE_ID' })
  offenceId: number;

  @ViewColumn({ name: 'OFFENCE_TYPE_ID' })
  offenceTypeId: number;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'PRISONER_ID' })
  prisonerId: number;

  @ViewColumn({ name: 'OFFENCE_DATE' })
  offenceDate: Date;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'UPDATED_EMPLOYEE_KEY_ID' })
  updatedEmployeeKeyId: number;

  @ViewColumn({ name: 'UPDATED_DATE' })
  updatedDate: Date;

  @ViewColumn({ name: 'OFFENCE_TYPE_NAME' })
  offenceTypeName: string;

  @ViewColumn({ name: 'OFFENCE_ACTION_TYPE_NAME' })
  offenceActionTypeName: string;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;

  @ViewColumn({ name: 'UPDATED_EMPLOYEE_NAME' })
  updatedEmployeeName: string;

  @ViewColumn({
    name: 'IS_CRIMINAL_CASE',
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => Boolean(value)
    }
  })
  isCriminalCase: boolean;

  static getTableFields() {
    return {
      offenceTypeName: { header: 'Зөрчлийн төрөл', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      offenceDate: { header: 'Зөрчил гаргасан огноо', type: 'date', sortable: true, filterable: true, width: 'w-48' },
      departmentName: { header: 'Хорих анги', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      wfmStatusName: { header: 'Төлөв', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      offenceActionTypeName: { header: 'Шийтгэл', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      description: { header: 'Тайлбар', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      isCriminalCase: { header: 'Эрүүгийн хэрэг үүссэн эсэх', type: 'boolean', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Үүсгэсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      updatedDate: { header: 'Засварласан огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' },
      updatedEmployeeName: { header: 'Засварласан ажилтан', type: 'string', sortable: true, filterable: true, width: 'w-48' },
    }
  }

}