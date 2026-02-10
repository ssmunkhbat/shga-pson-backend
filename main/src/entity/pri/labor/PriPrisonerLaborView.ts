
import { WfmStatus } from 'src/entity/wfmStatus.entity';
import { ViewEntity, ViewColumn, OneToOne, JoinColumn } from 'typeorm';
@ViewEntity({
  name: 'PRI_PRISONER_LABOR_VIEW',
  synchronize: false,
})
export class PriPrisonerLaborView {
  @ViewColumn({ name: 'PRISONER_LABOR_ID' })
  prisonerLaborId: number;

  @ViewColumn({ name: 'LABOR_ID' })
  laborId: number;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'PRISONER_NAME' })
  prisonerName: string;

  @ViewColumn({ name: 'REGISTER_NO' })
  registerNo: string;

  @ViewColumn({ name: 'LABOR_TYPE_ID' })
  laborTypeId: number;

  @ViewColumn({ name: 'LABOR_TYPE_NAME' })
  laborTypeName: string;

  @ViewColumn({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @ViewColumn({ name: 'END_DATE' })
  endDate: Date;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @OneToOne(() => WfmStatus, (ws) => ws.wfmStatusId)
  @JoinColumn({name: 'WFM_STATUS_ID'})
  wfmStatus: WfmStatus;

  @ViewColumn({ name: 'STATUS_NAME' })
  statusName: string;

  @ViewColumn({ name: 'IS_SALARY' })
  isSalary: number;

  @ViewColumn({ name: 'LABOR_RESULT_TYPE_ID' })
  laborResultTypeId: number;

  @ViewColumn({ name: 'LABOR_RESULT_TYPE_NAME' })
  laborResultTypeName: string;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;
  
  static getTableFields() {
    return {
      prisonerName: { header: 'Хоригдогч', type: 'string', width: 200, sortable: false, filterable: true },
      laborTypeName: { header: 'Ажлын төрөл', type: 'string', width: 150, sortable: false, filterable: true },
      beginDate: { header: 'Эхэлсэн', type: 'date', width: 120, sortable: false, filterable: true },
      wfmStatus: {
        header: 'Төлөв',
        type: 'refstatus',
        refField: 'wfmStatus.wfmStatusName', refListName: 'wfmStatusList', refListFilter: 'filters=[{"field":"WFM_STATUS_GROUP_ID","value":17860}]', refColorField: 'wfmStatus.wfmStatusColor', refBgColorField: 'wfmStatus.wfmStatusBgColor',
        sortable: false, filterable: true, width: 'w-16'
      },
      endDate: { header: 'Дуусах', type: 'date', width: 120, sortable: false, filterable: true },
      description: { header: 'Тайлбар', type: 'string', width: 200, sortable: true, filterable: true },
      createdDate: { header: 'Үүсгэсэн', type: 'date', width: 120, sortable: false, filterable: true },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', width: 150, sortable: true, filterable: true },
      isSalary: { header: 'Цалинтай', type: 'boolean', width: 80, sortable: false, filterable: true },
    };
  }
}
