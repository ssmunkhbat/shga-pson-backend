import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_PRISONER_BODY_ATTRIBUTE_VW')
export class PriPrisonerBodyAttributeView {
  @ViewColumn({ name: 'PRISONER_BODY_ATTRIBUTE_ID' })
  prisonerBodyAttributeId: number;

  @ViewColumn({ name: 'PRISONER_ID' })
  prisonerId: number;

  @ViewColumn({ name: 'BODY_ATTRIBUTE_ID' })
  bodyAttributeId: number;

  @ViewColumn({ name: 'BODY_ATTRIBUTE_TYPE_ID' })
  bodyAttributeTypeId: number;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: number;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: number;

  @ViewColumn({ name: 'BODY_ATTRIBUTE_NAME' })
  bodyAttributeName: number;

  @ViewColumn({ name: 'BODY_ATTRIBUTE_TYPE_NAME' })
  bodyAttributeTypeName: number;

  @ViewColumn({ name: 'EMPLOYEE_NAME' })
  employeeName: number;

  constructor(item: Partial<PriPrisonerBodyAttributeView>) {
    Object.assign(this, item)
  }

  static getTableFields() {
    return {
      bodyAttributeName: { header: 'Онцлог', type: 'string', sortable: true, filterable: false, width: 'w-16' },
      bodyAttributeTypeName: { header: 'Төрөл', type: 'string', sortable: true, filterable: false, width: 'w-16' },
      description: { header: 'Бусад онцлог шинж', type: 'string', sortable: true, filterable: false, width: 'w-16' },
      createdDate: { header: 'Үүсгэсэн огноо', type: 'datetime', sortable: true, filterable: false, width: 'w-16' },
      employeeName: { header: 'Албан хаагчийн нэр', type: 'string', sortable: true, filterable: false, width: 'w-16' },
    };
  }
}
