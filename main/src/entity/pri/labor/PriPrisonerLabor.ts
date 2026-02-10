import { WfmStatus } from 'src/entity/wfmStatus.entity';
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';

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
        
  @OneToOne(() => WfmStatus, (ws) => ws.wfmStatusId)
  @JoinColumn({name: 'WFM_STATUS_ID'})
  wfmStatus: WfmStatus;

  @Column({ name: 'IS_SALARY', default: 1, nullable: true })
  isSalary: number;

  static getTableFields() {
    return {
      prisonerName: { header: 'Хоригдогч', type: 'string', width: 200, sortable: true, filterable: true },
      registerNo: { header: 'Регистр', type: 'string', width: 100, sortable: true, filterable: true },
      laborTypeName: { header: 'Ажлын төрөл', type: 'string', width: 150, sortable: true, filterable: true },
      departmentName: { header: 'Алба хэлтэс', type: 'string', width: 150, sortable: true, filterable: true },
      beginDate: { header: 'Эхэлсэн', type: 'date', width: 120, sortable: true, filterable: true },
      endDate: { header: 'Дуусах', type: 'date', width: 120, sortable: true, filterable: true },
      statusName: { header: 'Төлөв', type: 'string', width: 120, sortable: true, filterable: true },
      createdDate: { header: 'Үүсгэсэн', type: 'date', width: 120, sortable: true, filterable: true },
      isSalary: { header: 'Цалинтай', type: 'boolean', width: 80, sortable: true, filterable: false }, // Could be mapped to Yes/No in frontend
    };
  }
}
