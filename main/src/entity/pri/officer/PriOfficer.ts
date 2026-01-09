
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'KHORIGDOL_VT', name: 'PRI_OFFICER' })
export class PriOfficer {
  @PrimaryColumn({ name: 'OFFICER_ID' })
  officerId: number;

  @Column({ name: 'FIRST_NAME', nullable: true })
  firstName: string;

  @Column({ name: 'LAST_NAME', nullable: true })
  lastName: string;

  @Column({ name: 'ID_NUMBER', nullable: true })
  idNumber: string;

  @Column({ name: 'DEPARTMENT_ID', nullable: true })
  departmentId: number;

  @Column({ name: 'PHONE', nullable: true })
  phone: string;

  @Column({ name: 'POSITION', nullable: true })
  position: string;

  // @Column({ name: 'IS_ACTIVE', nullable: true })
  // isActive: number;
}
