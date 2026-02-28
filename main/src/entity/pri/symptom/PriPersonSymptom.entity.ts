import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_PERSON_SYMPTOM')
export class PriPersonSymptom {
  @PrimaryGeneratedColumn({ name: 'PERSON_SYMPTOM_ID' })
  personSymptomId: number;

  @Column({ name: 'SYMPTOM_ID' })
  symptomId: number;

  @Column({ name: 'ORGAN_ID' })
  organId: number;

  @Column({ name: 'PERSON_ID' })
  personId: number;

  @Column({ name: 'EMPLOYEE_KEY_ID' })
  employeeKeyId: number;

  @Column({ name: 'ORGAN_DETAIL_ID' })
  organDetailId: number;

  @Column({ name: 'IS_ACTIVE' })
  isActive: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: number;

  @Column({ name: 'DESCRIPTION' })
  description: number;

  @Column({ name: 'FILE_PATH' })
  filePath: number;

  constructor(item: Partial<PriPersonSymptom>) {
    Object.assign(this, item)
  }
}