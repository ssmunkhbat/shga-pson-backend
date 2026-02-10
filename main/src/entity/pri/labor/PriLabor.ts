import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('PRI_LABOR', { schema: 'KHORIGDOL_VT' })
export class PriLabor {
  @PrimaryColumn({ name: 'LABOR_ID' })
  laborId: number;

  @Column({ name: 'LABOR_TYPE_ID' })
  laborTypeId: number;

  @Column({ name: 'DEPARTMENT_ID' })
  departmentId: number;

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


}
