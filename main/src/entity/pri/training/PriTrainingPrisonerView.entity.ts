import { Column,  PrimaryGeneratedColumn, ViewColumn, ViewEntity } from "typeorm";
@ViewEntity('PRI_TRAINING_PRISONER_VIEW')
export class PriTrainingPrisonerView {

  @ViewColumn({ name: 'TRAINING_PRISONER_ID' })
  trainingPrisonerId: number;

  @ViewColumn({ name: 'TRAINING_ID' })
  trainingId: number;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'PRISONER_ID' })
  prisonerId: number;

  @ViewColumn({ name: 'INFO_TRAINING_ID' })
  infoTrainingId: number;

  @ViewColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @ViewColumn({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @ViewColumn({ name: 'END_DATE' })
  endDate: Date;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @ViewColumn({ name: 'TIMES_A_WEEK' })
  timesAWeek: number;

  @ViewColumn({ name: 'TIME_OF_DAY' })
  timeOfDay: Date;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'TRAINING_NAME' })
  trainingName: string;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_CODE' })
  createdEmployeeCode: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;

}
