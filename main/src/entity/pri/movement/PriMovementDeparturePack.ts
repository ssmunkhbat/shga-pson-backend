
import { Column, Entity, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { PriInfoDepartment } from 'src/entity/info/priInfoDepartment';

@Entity({ schema: 'KHORIGDOL_VT', name: 'PRI_MOVEMENT_DEPARTURE_PACK' })
export class PriMovementDeparturePack {
  @PrimaryColumn({ name: 'MOVEMENT_DEPARTURE_PACK_ID' })
  movementDeparturePackId: number;

  @Column({ name: 'DEPARTURE_DATE', type: 'date', nullable: true })
  departureDate: Date;

  @Column({ name: 'FROM_DEPARTMENT_ID', nullable: true })
  fromDepartmentId: number;

  @OneToOne(() => PriInfoDepartment, (d) => d.departmentId)
  @JoinColumn({ name: 'FROM_DEPARTMENT_ID' })
  fromDepartment: PriInfoDepartment;

  @Column({ name: 'TO_DEPARTMENT_ID', nullable: true })
  toDepartmentId: number;

  @OneToOne(() => PriInfoDepartment, (d) => d.departmentId)
  @JoinColumn({ name: 'TO_DEPARTMENT_ID' })
  toDepartment: PriInfoDepartment;

  @Column({ name: 'ADMINISTRATIVE_DECISION_ID', nullable: true })
  decisionId: number;

  @Column({ name: 'OFFICER_ID', nullable: true })
  officerId: number;

  @Column({ name: 'EMPLOYEE_ID', nullable: true })
  employeeId: number; // Used for "Other" officer or textual name

  // @Column({ name: 'GRANT_PASSWORD', nullable: true })
  // grantPassword: string;

  @Column({ name: 'WFM_STATUS_ID', nullable: true })
  wfmStatusId: number;

  @Column({ name: 'MOVEMENT_TYPE_ID', nullable: true })
  movementTypeId: number;

  @Column({ name: 'NUMBER_OF_PRISONERS', nullable: true })
  numberOfPrisoners: number;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID', nullable: true })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE', type: 'date', default: () => 'SYSDATE' })
  createdDate: Date;

  constructor(item: Partial<PriMovementDeparturePack>) {
    Object.assign(this, item)
  }
}
