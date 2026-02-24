import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_LOGIN_LOG_VIEW')
export class PriLoginLogView {
  @ViewColumn({ name: 'LOGIN_LOG_ID' })
  loginLogId: number;

  @ViewColumn({ name: 'USER_ID' })
  userId: number;
  
  @ViewColumn({ name: 'LOGIN_DATE' })
  loginDate: Date;

  @ViewColumn({ name: 'EMPLOYEE_KEY_ID' })
  employeeKeyId: number;

  @ViewColumn({ name: 'IP_ADDRESS' })
  ipAddress: string;

  @ViewColumn({ name: 'LOGIN_DATE_STRING' })
  loginDateString: string;
  
  @ViewColumn({ name: 'USERNAME' })
  username: string;
  
  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'LOGIN_DATE' })
  createdDate: Date;
  
  static getTableFields() {
    return {
      loginDate: { header: 'Нэвтэрсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' },
      ipAddress: { header: 'IP хаяг', type: 'string', sortable: true, filterable: true, width: 'w-16' },
      username: { header: 'Нэвтрэх нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      firstName: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      departmentName: { header: 'Алба хэлтэс', type: 'string', sortable: true, filterable: true, width: 'w-48' },
    }
  }
}