import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_DEPARTMENT_TYPE')
export class PriInfoDepartmentType{

  @PrimaryGeneratedColumn({ name: "DEPARTMENT_TYPE_ID" })
  departmentTypeId: number;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "NAME" })
  name: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: "DISPLAY_INDEX" })
  displayIndex: number;

  constructor(item: Partial<PriInfoDepartmentType>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      positionTypeId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      displayIndex: { header: 'Эрэмбэ', type: 'number', sortable: true, filterable: false, width: 'w-16' },
    };
  }
}