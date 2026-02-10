
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `SELECT * FROM "KHORIGDOL_VT"."PRI_LABOR_VIEW"`,
  name: 'PRI_LABOR_VIEW',
  schema: 'KHORIGDOL_VT',
})
export class PriLaborView {
  @ViewColumn({ name: 'LABOR_ID' })
  laborId: number;

  @ViewColumn({ name: 'LABOR_TYPE_ID' })
  laborTypeId: number;

  @ViewColumn({ name: 'LABOR_TYPE_NAME' })
  laborTypeName: string;

  @ViewColumn({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @ViewColumn({ name: 'END_DATE' })
  endDate: Date;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'EMPLOYEE_NAME' })
  employeeName: string;

  static getTableFields() {
    return {
      laborTypeName: { header: 'Ангилал', type: 'string', width: 150, sortable: true, filterable: true },
      beginDate: { header: 'Эхэлсэн огноо', type: 'date', width: 120, sortable: true, filterable: true },
      endDate: { header: 'Дуусах огноо', type: 'date', width: 120, sortable: true, filterable: true },
      createdDate: { header: 'Үүсгэсэн огноо', type: 'date', width: 120, sortable: true, filterable: true },
      departmentName: { header: 'Хэлтэс тасгийн нэр', type: 'string', width: 200, sortable: true, filterable: true },
      employeeName: { header: 'Үүсгэсэн албан хаагч', type: 'string', width: 150, sortable: true, filterable: true },
    };
  }
}
