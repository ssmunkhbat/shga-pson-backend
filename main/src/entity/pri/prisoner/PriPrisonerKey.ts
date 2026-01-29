import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('PRI_PRISONER_KEY')
export class PriPrisonerKey {
  @PrimaryColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'PRISONER_ID' })
  prisonerId: number;

  @Column({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @Column({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @Column({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @Column({ name: 'END_DATE', nullable: true })
  endDate: Date | null;

  @Column({ name: 'DETENTION_ID', nullable: true })
  detentionId: number;

  @Column({ name: 'DECISION_ID', nullable: true })
  decisionId: number;
  
  @Column({ name: 'DEPARTMENT_REGIME_ID', nullable: true })
  regimenId: number;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID', nullable: true })
  createdBy: number;

  @Column({ name: 'CREATED_DATE', default: () => 'SYSDATE' })
  createdDate: Date;

  constructor(item: Partial<PriPrisonerKey>) {
    Object.assign(this, item)
  }
}
