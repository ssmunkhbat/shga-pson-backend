import {  ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_PERSON_SYMPTOM_VIEW')
export class PriPersonSymptomView {

  @ViewColumn({ name: 'PERSON_SYMPTOM_ID' })
  personSymptomId: number;

  @ViewColumn({ name: 'SYMPTOM_ID' })
  symptomId: number;

  @ViewColumn({ name: 'ORGAN_ID' })
  organId: number;

  @ViewColumn({ name: 'PERSON_ID' })
  personId: number;

  @ViewColumn({ name: 'EMPLOYEE_KEY_ID' })
  employeeKeyId: number;

  @ViewColumn({ name: 'ORGAN_DETAIL_ID' })
  organDetailId: number;

  @ViewColumn({ name: 'IS_ACTIVE' })
  isActive: number;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: number;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: number;

  @ViewColumn({ name: 'FILE_PATH' })
  filePath: number;

  @ViewColumn({ name: 'SYMPTOM_NAME' })
  symptomName: string;

  @ViewColumn({ name: 'ORGAN_NAME' })
  organName: string;

  @ViewColumn({ name: 'ORGAN_DETAIL_NAME' })
  organDetailName: string;

  @ViewColumn({ name: 'ORGAN_DISPLAY_INDEX' })
  organDisplayIndex: number;

  @ViewColumn({ name: 'ORGAN_DETAIL_DISPLAY_INDEX' })
  organDetailDisplayIndex: number;

  static getTableFields() {
    return {
      symptomName: { header: 'Шинж тэмдэг', type: 'string', sortable: true, filterable: false, width: 'w-16' },
      organName: { header: 'Хэсэг', type: 'string', sortable: true, filterable: false, width: 'w-16' },
      organDetailName: { header: 'Эрхтэн', type: 'string', sortable: true, filterable: false, width: 'w-16' },
      description: { header: 'Тайлбар', type: 'string', sortable: true, filterable: false, width: 'w-16' }
    };
  }
}