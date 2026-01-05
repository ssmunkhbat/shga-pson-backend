import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { PriEmployee } from './priEmployee';
import { PriInfoPositionType } from 'src/entity/info/priInfoPositionType';
import { PriInfoMilitaryRank } from 'src/entity/info/priInfoMilitaryRank';
import { PriInfoDepartment } from 'src/entity/info/priInfoDepartment';

@Entity('PRI_EMPLOYEE_KEY')
export class PriEmployeeKey {

  @PrimaryGeneratedColumn({ name: "EMPLOYEE_KEY_ID" })
  employeeKeyId: number;

  @Column({ name: "EMPLOYEE_ID" })
  employeeId: number;

  @OneToOne(() => PriEmployee, (pe) => pe.employeeId)
  @JoinColumn({name: 'EMPLOYEE_ID'})
  employee: PriEmployee;

  @Column({ name: "POSITION_TYPE_ID" })
  positionTypeId: number;

  @OneToOne(() => PriInfoPositionType, (pt) => pt.positionTypeId)
  @JoinColumn({name: 'POSITION_TYPE_ID'})
  positionType: PriInfoPositionType;

  @Column({ name: "MILITARY_RANK_ID" })
  militaryRankId: number;

  @OneToOne(() => PriInfoMilitaryRank, (mr) => mr.militaryRankId)
  @JoinColumn({name: 'MILITARY_RANK_ID'})
  militaryRank: PriInfoMilitaryRank;

  @Column({ name: "DEPARTMENT_ID" })
  departmentId: number;

  @OneToOne(() => PriInfoDepartment, (d) => d.departmentId)
  @JoinColumn({name: 'DEPARTMENT_ID'})
  department: PriInfoDepartment;

  @Column({ name: "IS_ACTIVE" })
  isActive: boolean;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  constructor(item: Partial<PriEmployeeKey>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      // employeeKeyId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      employeeId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      'employee.person.stateRegNumber': { header: 'Регистр', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      'employee.person.lastName': { header: 'Эцэг/Эх-ийн нэр', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      'employee.person.firstName': { header: 'Өөрийн нэр', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      'employee.user.userName': { header: 'Хэрэглэгчийн нэр', type: 'ref', sortable: false, filterable: true, width: 'w-16' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: false, width: 'w-40' },
    };
  }
}