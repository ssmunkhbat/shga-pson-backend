import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_OFFENCE')
export class PriOffence {
  @PrimaryGeneratedColumn({ name: 'OFFENCE_ID' })
  offenceId: number;

  @Column({ name: 'OFFENCE_TYPE_ID' })
  offenceTypeId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'OFFENCE_DATE' })
  offenceDate: Date;

  @Column({ name: 'DESCRIPTION' })
  description: string;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'UPDATED_EMPLOYEE_KEY_ID' })
  updatedEmployeeKeyId: number;

  @Column({ name: 'UPDATED_DATE' })
  updatedDate: Date;

  @Column({ name: 'ARREST_ID' })
  arrestId: number;

  @Column({
    name: 'IS_CRIMINAL_CASE',
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => Boolean(value)
    }
  })
  isCriminalCase: boolean;

  constructor(item: Partial<PriOffence>) {
    Object.assign(this, item)
  }
  
}