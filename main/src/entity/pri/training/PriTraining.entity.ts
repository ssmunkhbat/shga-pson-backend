import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_TRAINING')
export class PriTraining {
  @PrimaryGeneratedColumn({ name: 'TRAINING_ID' })
  trainingId: number;

  @Column({ name: 'INFO_TRAINING_ID' })
  infoTrainingId: number;

  @Column({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @Column({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @Column({ name: 'END_DATE' })
  endDate: Date;

  @Column({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @Column({ name: 'TIMES_A_WEEK' })
  timesAWeek: number;

  @Column({ name: 'TIME_OF_DAY' })
  timeOfDay: Date;

  @Column({ name: 'DESCRIPTION' })
  description: string;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'FINISH_TIME_OF_DAY' })
  finishTimeOfDay: Date;

  @Column({ name: 'TEACHER_NAME' })
  teacherName: string;

  constructor(item: Partial<PriTraining>) {
    Object.assign(this, item)
  }
}
