import { Column, Entity, PrimaryGeneratedColumn,  } from "typeorm";

@Entity('PRI_OFFENCE_ACTION')
export class PriOffenceAction {

  @PrimaryGeneratedColumn({ name: 'OFFENCE_ACTION_ID' })
  offenceActionId: number;

  @Column({ name: 'OFFENCE_ID' })
  offenceId: number;

  @Column({ name: 'ADMINISTRATIVE_DECISION_ID' })
  administrativeDecisionId: number;

  @Column({ name: 'DESCRIPTION' })
  description: string;

  @Column({ name: 'PRISONER_BONUS_DAY_ID' })
  prisonerBonusDayId: number;

  @Column({ name: 'DISCIPLINE_CELL_BOOK_ID' })
  disciplineCellBookId: number;

  @Column({ name: 'PRISONER_LABOR_ID' })
  prisonerLaborId: number;

  @Column({ name: 'OFFENCE_ACTION_TYPE_ID' })
  offenceActionTypeId: number;

  @Column({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @Column({ name: 'UPDATED_DATE' })
  updatedDate: Date;

  @Column({ name: 'UPDATED_EMPLOYEE_KEY_ID' })
  updatedEmployeeKeyId: number;

  @Column({ name: 'CANCELLED_STATUS_ID' })
  cancelledStatusId: number;
  
  constructor(item: Partial<PriOffenceAction>) {
    Object.assign(this, item)
  }
}