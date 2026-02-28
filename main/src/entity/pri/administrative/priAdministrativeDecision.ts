import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PriAdministrativeDecType } from './priAdministrativeDecType';
import { PriEmployee } from '../employee/priEmployee';
import { PriInfoDepartment } from 'src/entity/info/priInfoDepartment';

@Entity('PRI_ADMINISTRATIVE_DECISION')
export class PriAdministrativeDecision {
  @PrimaryGeneratedColumn({ name: 'ADMINISTRATIVE_DECISION_ID' })
  administrativeDecisionId: number;

  @Column({ name: 'ADMINISTRATIVE_DECISION_NUMBER' })
  administrativeDecisionNumber: string;

  @Column({ name: 'DECISION_DATE' })
  decisionDate: Date;

  @Column({ name: 'DECISION_TYPE_ID' })
  departmentTypeId: number;

  @OneToOne(() => PriAdministrativeDecType, (dt) => dt.decisionTypeId)
  @JoinColumn({ name: 'DECISION_TYPE_ID' })
  decisionType: PriAdministrativeDecType;

  @Column({ name: 'EMPLOYEE_ID' })
  employeeId: number;

  @OneToOne(() => PriEmployee, (pe) => pe.employeeId)
  @JoinColumn({ name: 'EMPLOYEE_ID' })
  employee: PriEmployee;

  @Column({ name: 'EMPLOYEE_NAME' })
  employeeName: string;

  @Column({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @OneToOne(() => PriInfoDepartment, (d) => d.departmentId)
  @JoinColumn({ name: 'DEPARTMENT_ID' })
  department: PriInfoDepartment;

  @Column({ name: 'CREATED_DATE', default: new Date() })
  createdDate: Date;

  @Column({ name: 'CONTENT' })
  content: string;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  constructor(item: Partial<PriAdministrativeDecision>) {
    Object.assign(this, item);
  }

  /*
   * Table-ын талбаруудын мэдээлэл
   */
  static getTableFields() {
    return {
      administrativeDecisionId: {
        header: 'ID',
        type: 'number',
        sortable: true,
        filterable: false,
        width: 'w-16',
      },
      administrativeDecisionNumber: {
        header: 'Шийдвэрийн дугаар',
        type: 'string',
        sortable: true,
        filterable: true,
        width: 'w-48',
      },
      decisionDate: {
        header: 'Шийдвэрийн огноо',
        type: 'date',
        sortable: true,
        filterable: true,
        width: 'w-48',
      },
      'decisionType.name': {
        header: 'Шийдвэрийн төрөл',
        type: 'ref',
        refField: 'decisionType.name',
        sortable: false,
        filterable: true,
        width: 'w-16',
      },
      'department.name': {
        header: 'Алба хэлтэс',
        type: 'ref',
        refField: 'department.name',
        sortable: false,
        filterable: true,
        width: 'w-16',
      },
      'employee.person.firstName': {
        header: 'Албан хаагч',
        type: 'ref',
        refField: 'employee.person.firstName',
        sortable: false,
        filterable: true,
        width: 'w-16',
      },
      createdDate: {
        header: 'Үүсгэсэн огноо',
        type: 'date',
        sortable: true,
        filterable: false,
        width: 'w-16',
      },
    };
  }
}
