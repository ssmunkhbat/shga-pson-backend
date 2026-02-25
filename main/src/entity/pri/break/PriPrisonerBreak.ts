import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity("PRI_PRISONER_BREAK")
export class PriPrisonerBreak {
  @PrimaryColumn({ name: 'PRISONER_BREAK_ID' })
  prisonerBreakId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'BREAK_DATE' })
  breakDate: Date;

  @Column({ name: 'DESCRIPTION', nullable: true })
  description: string;

  @Column({ name: 'WFM_STATUS_ID', nullable: true })
  wfmStatusId: number;

  @Column({ name: 'FOUND_DATE', nullable: true })
  foundDate: Date;


  @Column({ name: 'IS_TRACKING', nullable: true })
  isTracking: number;

  @Column({ name: 'HAS_REWARD', nullable: true })
  hasReward: number;

  @Column({ name: 'REWARD_AMOUNT', nullable: true })
  rewardAmount: number;

  @Column({ name: 'CONTACT_INFO', nullable: true })
  contactInfo: string;

  @Column({ name: 'IS_ACTIVE', default: 1 })
  isActive: number;

  @Column({ name: 'DELETED', nullable: true })
  deleted: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  constructor(item: Partial<PriPrisonerBreak>) {
    Object.assign(this, item)
  }
}
