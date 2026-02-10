import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_LABOR_TYPE')
export class PriInfoLaborType {
  @PrimaryGeneratedColumn({ name: 'LABOR_TYPE_ID' })
  laborTypeId: number;

  @Column({ name: 'NAME' })
  name: string;

  @Column({ name: 'IS_ACTIVE', default: true })
  isActive: boolean;
}
