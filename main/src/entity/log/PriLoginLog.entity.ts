import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_LOGIN_LOG')
export class PriLoginLog {
  @PrimaryGeneratedColumn({ name: 'LOGIN_LOG_ID' })
  loginLogId: number;
  @Column({ name: 'USER_ID' })
  userId: number;
  @Column({ name: 'LOGIN_DATE' })
  loginDate: Date;
  @Column({ name: 'EMPLOYEE_KEY_ID' })
  employeeKeyId: number;
  @Column({ name: 'IP_ADDRESS' })
  ipAddress: string;
}