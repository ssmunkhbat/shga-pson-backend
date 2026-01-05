import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { PriInfoDepartmentType } from './priInfoDepartmentType';

@Entity('PRI_INFO_DEPARTMENT')
export class PriInfoDepartment{

  @PrimaryGeneratedColumn({ name: "DEPARTMENT_ID" })
  departmentId: number;

  @Column({ name: "PARENT_ID" })
  parentId: number;

  @OneToOne(() => PriInfoDepartment, (dm) => dm.departmentId)
  @JoinColumn({name: 'PARENT_ID'})
  parent: PriInfoDepartment;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "NAME" })
  name: string;
  
  @Column({ name: "DEPARTMENT_TYPE_ID" })
  departmentTypeId: number;

  @OneToOne(() => PriInfoDepartmentType, (dt) => dt.departmentTypeId)
  @JoinColumn({name: 'DEPARTMENT_TYPE_ID'})
  departmentType: PriInfoDepartmentType;

  @Column({ name: "SHORT_NAME" })
  shortName: string;

  @Column({ name: "JUDGE_DEPARTMENT_ID" })
  judgeDepartmentId: number;

  @Column({ name: "IS_REPORT" })
  isReport: boolean;

  @Column({ name: "IS_ROUND" })
  isRound: boolean;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: "DISPLAY_INDEX" })
  displayIndex: number;

  constructor(item: Partial<PriInfoDepartment>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      militaryRankId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      displayIndex: { header: 'Эрэмбэ', type: 'number', sortable: true, filterable: false, width: 'w-16' },
    };
  }
}