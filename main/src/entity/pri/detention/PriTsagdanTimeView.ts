import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `SELECT * FROM "KHORIGDOL_VT"."PRI_TSAGDAN_TIME_VIEW"`,
  name: 'PRI_TSAGDAN_TIME_VIEW',
  schema: 'KHORIGDOL_VT',
})
export class PriTsagdanTimeView {
  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'STATE_REG_NUMBER' })
  stateRegNumber: string;

  @ViewColumn({ name: 'LAST_NAME' })
  lastName: string;

  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'JAIL_PLAN_ID' })
  jailPlanId: number;

  @ViewColumn({ name: 'JAIL_BEGIN_DATE' })
  jailBeginDate: Date;

  @ViewColumn({ name: 'JAIL_MONTHS' })
  jailMonths: number;

  @ViewColumn({ name: 'JAIL_DAYS' })
  jailDays: number;

  @ViewColumn({ name: 'RELEASE_DATE' })
  releaseDate: Date;

  @ViewColumn({ name: 'REMAINING_DAYS' })
  remainingDays: number;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  static getTableFields() {
    return {
      departmentName: { header: 'Хорих анги, албадын нэр', type: 'string', width: 250, sortable: true, filterable: true },
      stateRegNumber: { header: 'Регистерийн дугаар', type: 'string', width: 150, sortable: true, filterable: true },
      lastName: { header: 'Эцэг/эх-ийн нэр', type: 'string', width: 150, sortable: true, filterable: true },
      firstName: { header: 'Өөрийн нэр', type: 'string', width: 150, sortable: true, filterable: true },
      wfmStatusName: { header: 'Төлөв', type: 'string', width: 150, sortable: true, filterable: true },
      jailBeginDate: { header: 'Эхлэх огноо', type: 'date', width: 150, sortable: true, filterable: true },
      jailMonths: { header: 'Сар', type: 'number', width: 80, sortable: true, filterable: true },
      jailDays: { header: 'Өдөр', type: 'number', width: 80, sortable: true, filterable: true },
      releaseDate: { header: 'Дуусах огноо', type: 'date', width: 150, sortable: true, filterable: true },
      remainingDays: { header: 'Үлдсэн хоног', type: 'number', width: 120, sortable: true, filterable: true },
    };
  }
}
