import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity('PRI_TRAINING_PRISONER')
export class PriTrainingPrisoner {

  @PrimaryGeneratedColumn({ name: 'TRAINING_PRISONER_ID' })
  trainingPrisonerId: number;

  @Column({ name: 'TRAINING_ID' })
  trainingId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

}
