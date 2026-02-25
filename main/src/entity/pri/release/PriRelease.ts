import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('PRI_RELEASE')
export class PriRelease {
  @PrimaryColumn({ name: 'RELEASE_ID' })
  releaseId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'DECISION_ID', nullable: true })
  decisionId: number;

  @Column({ name: 'RELEASE_TYPE_ID' })
  releaseTypeId: number;

  @Column({ name: 'RELEASE_DATE' })
  releaseDate: Date;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID', nullable: true })
  createdEmployeeKeyId: number;

  @Column({ name: 'DESCRIPTION', nullable: true })
  description: string;

  @Column({ name: 'IS_ROLLEDBACK', nullable: true })
  isRolledback: number;

  @Column({ name: 'ROLLEDBACK_DATE', nullable: true })
  rolledbackDate: Date;

  constructor(item: Partial<PriRelease>) {
    Object.assign(this, item)
  }
}
