import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PRI_PRISONER_LABOR', { schema: 'KHORIGDOL_VT' })
export class PriPrisonerLabor {
  @PrimaryColumn({ name: 'PRISONER_LABOR_ID' })
  prisonerLaborId: number;

  @Column({ name: 'LABOR_ID' })
  laborId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'LABOR_TYPE_ID' })
  laborTypeId: number;

  @Column({ name: 'LABOR_RESULT_TYPE_ID', nullable: true })
  laborResultTypeId: number;

  @Column({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @Column({ name: 'END_DATE', nullable: true })
  endDate: Date;

  @Column({ name: 'DESCRIPTION', nullable: true })
  description: string;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID', nullable: true })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE', default: () => 'sysdate' })
  createdDate: Date;

  @Column({ name: 'WFM_STATUS_ID', default: 17861, nullable: true })
  wfmStatusId: number;

  @Column({ name: 'IS_SALARY', default: 1, nullable: true })
  isSalary: number;
}
