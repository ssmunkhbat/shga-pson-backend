import { Column, PrimaryGeneratedColumn, ViewEntity } from 'typeorm';

@ViewEntity('PRI_DECISION_VIEW')
export class PriDecisionView {

  @PrimaryGeneratedColumn({ name: "DECISION_ID" })
  decisionId: number;

  @Column({ name: "DECISION_NUMBER" })
  decisionNumber: string;

  @Column({ name: "DECISION_DATE" })
  decisionDate: Date;

  @Column({ name: "DECISION_TYPE_ID" })
  decisionTypeId: number;

  @Column({ name: "DECISION_TYPE_NAME" })
  decisionTypeName: string;

  @Column({ name: "DEPARTMENT_ID" })
  departmentId: number;

  @Column({ name: "DEPARTMENT_NAME" })
  departmentName: string;

  @Column({ name: "EMPLOYEE_ID" })
  personId: number;

  @Column({ name: "EMPLOYEE_NAME" })
  employeeName: string;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  @Column({ name: "CREATED_EMPLOYEE_KEY_ID" })
  createdEmployeeKeyId: number;

  @Column({ name: "CREATED_EMPLOYEE_CODE" })
  createdEmployeeCode: string;

  @Column({ name: "CREATED_EMPLOYEE_NAME" })
  createdEmployeeName: string;

  constructor(item: Partial<PriDecisionView>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      decisionId: { header: 'Системийн дугаар', type: 'number', sortable: false, filterable: false, width: 'w-16' },
      decisionDate: { header: 'Огноо', type: 'date', sortable: false, filterable: true, width: 'w-40' },
      decisionNumber: { header: 'Дугаар', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      decisionTypeName: { header: 'Төрөл', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      departmentName: { header: 'Алба хэлтэс', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      employeeName: { header: 'Албан хаагч', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: false, filterable: true, width: 'w-40' },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      createdEmployeeCode: { header: 'Бүртгэсэн ажилтны код', type: 'string', sortable: false, filterable: true, width: 'w-48' },
    };
  }
}