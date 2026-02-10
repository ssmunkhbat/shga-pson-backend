import { PriInfoLeaveType } from "src/entity/info/priInfoLeaveType.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_LEAVE')
export class PriLeave {
  @PrimaryGeneratedColumn({ name: 'LEAVE_ID' })
  leaveId: string;

  @Column({ name: 'LEAVE_TYPE_ID' })
  leaveTypeId: number;

  @ManyToOne(() => PriInfoLeaveType, (at) => at.leaveTypeId)
  @JoinColumn({ name: 'LEAVE_TYPE_ID' })
  leaveType: PriInfoLeaveType;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'DECISION_ID' })
  decisionId: number;
  
  @Column({ name: 'OFFICER_ID' })
  officerId: number;

  @Column({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @Column({ name: 'LEAVE_DATE' })
  leaveDate: Date;

  @Column({ name: 'ARRIVE_DATE' })
  arriveDate: Date;

  @Column({ name: 'RECEIVED_DATE' })
  receivedDate: Date;

  @Column({ name: 'DESCRIPTION' })
  description: string;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({
    name: 'IS_CRIME_DURING_LEAVE',
    default: 0,
    precision: 1,
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => Boolean(value)
    }
  })
  isCrimeDuringLeave: boolean;

  constructor(item: Partial<PriLeave>) {
    Object.assign(this, item)
  }
}
