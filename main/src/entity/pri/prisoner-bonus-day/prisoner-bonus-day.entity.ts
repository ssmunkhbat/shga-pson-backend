import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_PRISONER_BONUS_DAY')
export class PriPrisonerBonusDay {

  @PrimaryGeneratedColumn({ name: 'PRISONER_BONUS_DAY_ID' })
  prisonerBonusDayId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'BONUS_DAY_TYPE_ID' })
  bonusDayTypeId: number;

  @Column({ name: 'DAYS' })
  days: number;

  @Column({ name: 'DESCRIPTION' })
  description: string;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'JAIL_PLAN_ID' })
  jailPlanId: number;

  @Column({ name: 'DATE_OF_BONUS' })
  dateOfBonus: Date;

  @Column({ name: 'ADMINISTRATIVE_DECISION_ID' })
  administrativeDecisionId: number;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @Column({ name: 'PRISONER_LABOR_ID' })
  prisonerLaborId: number;

  @Column({ name: 'FILE_PATH' })
  filePath: string;

  @Column({ name: 'DECISION_NUMBER' })
  decisionNumber: string;

  constructor(item: Partial<PriPrisonerBonusDay>) {
    Object.assign(this, item)
  }
}
