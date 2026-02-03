import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_DECISION')
export class PriDecision {

  @PrimaryGeneratedColumn({ name: "DECISION_ID" })
  decisionId: number;

  @Column({ name: "DECISION_NUMBER" })
  decisionNumber: string;

  @Column({ name: "DECISION_DATE" })
  decisionDate: Date;

  @Column({ name: "DECISION_TYPE_ID" })
  decisionTypeId: number;

  @Column({ name: "DEPARTMENT_ID" })
  departmentId: number;

  @Column({ name: "EMPLOYEE_ID" })
  personId: number;

  @Column({ name: "EMPLOYEE_NAME" })
  employeeName: string;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  @Column({ name: "CREATED_EMPLOYEE_KEY_ID" })
  createdEmployeeKeyId: number;

  @Column({ name: "DOCUMENT_REGISTRATION_ID" })
  documentRegistrationId: number;

  constructor(item: Partial<PriDecision>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      decisionId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      decisionNumber: { header: 'Дугаар', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      decisionDate: { header: 'Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
    };
  }
}