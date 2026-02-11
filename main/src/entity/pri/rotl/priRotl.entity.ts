import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_ROTL')
export class PriRotl {
  @PrimaryGeneratedColumn({ name: 'ROTL_ID' })
  rotlId: string;

  @Column({ name: 'ROTL_TYPE_ID' })
  rotlTypeId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'ADMINISTRATIVE_DECISION_ID' })
  administrativeDecisionId: number;
  
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

  constructor(item: Partial<PriRotl>) {
    Object.assign(this, item)
  }
}
