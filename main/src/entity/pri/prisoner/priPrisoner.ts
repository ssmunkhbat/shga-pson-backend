import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_PRISONER')
export class PriPrisoner {

  @PrimaryGeneratedColumn({ name: "PRISONER_ID" })
  prisonerId: number;

  @Column({ name: "PRISONER_NUMBER" })
  prisonerNumber: string;

  @Column({ name: "PERSON_ID" })
  personId: number;

  @Column({ name: "WFM_STATUS_ID" })
  wfmStatusId: number;

  @Column({ name: "NICKNAME" })
  nickname: string;

  @Column({ name: "PICTURE_PATH" })
  picturePath: string;

  @Column({ name: "CREATED_EMPLOYEE_KEY_ID" })
  createdEmployeeKeyId: number;

  @Column({ name: "DEPARTMENT_ID" })
  departmentId: number;

  @Column({ name: "IS_RECIDIVIST" })
  isRecidivist: boolean;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  constructor(item: Partial<PriPrisoner>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      prisonerId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      nickname: { header: 'Хэрэглэгчийн Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
    };
  }
}