
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT 
        PL.PRISONER_LABOR_ID,
        PL.LABOR_ID,
        PL.PRISONER_KEY_ID,
        BP.LAST_NAME || ' ' || BP.FIRST_NAME AS PRISONER_NAME,
        P.PRISONER_NUMBER AS REGISTER_NO,
        PL.LABOR_TYPE_ID,
        LT.NAME AS LABOR_TYPE_NAME,
        PL.BEGIN_DATE,
        PL.END_DATE,
        PL.WFM_STATUS_ID,
        WS.WFM_STATUS_NAME AS STATUS_NAME,
        PL.IS_SALARY,
        PL.LABOR_RESULT_TYPE_ID,
        LRT.NAME AS LABOR_RESULT_TYPE_NAME,
        PL.DESCRIPTION,
        PL.CREATED_DATE,
        D.NAME AS DEPARTMENT_NAME
    FROM PRI_PRISONER_LABOR PL
    LEFT JOIN PRI_PRISONER_KEY K ON PL.PRISONER_KEY_ID = K.PRISONER_KEY_ID
    LEFT JOIN PRI_PRISONER P ON K.PRISONER_ID = P.PRISONER_ID
    LEFT JOIN BASE_PERSON BP ON P.PERSON_ID = BP.PERSON_ID
    LEFT JOIN PRI_LABOR L ON PL.LABOR_ID = L.LABOR_ID
    LEFT JOIN PRI_INFO_DEPARTMENT D ON L.DEPARTMENT_ID = D.DEPARTMENT_ID
    LEFT JOIN PRI_INFO_LABOR_TYPE LT ON PL.LABOR_TYPE_ID = LT.LABOR_TYPE_ID
    LEFT JOIN WFM_STATUS WS ON PL.WFM_STATUS_ID = WS.WFM_STATUS_ID
    LEFT JOIN PRI_INFO_LABOR_RESULT_TYPE LRT ON PL.LABOR_RESULT_TYPE_ID = LRT.LABOR_RESULT_TYPE_ID
  `,
  name: 'PRI_PRISONER_LABOR_VIEW',
  schema: 'KHORIGDOL_VT',
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
      isSalary: { header: 'Цалинтай', type: 'number', width: 80, sortable: true, filterable: false }, // Could be mapped to Yes/No in frontend
    };
  }
}
