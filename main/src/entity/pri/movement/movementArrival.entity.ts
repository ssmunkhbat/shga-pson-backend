
import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `SELECT * FROM "KHORIGDOL_VT"."PRI_MOVEMENT_ARRIVAL_PACK_VIEW"`,
  name: 'PRI_MOVEMENT_ARRIVAL_PACK_VIEW',
  schema: 'KHORIGDOL_VT',
})
export class MovementArrival {
  @ViewColumn({ name: 'MOVEMENT_ARRIVAL_PACK_ID' })
  movementArrivalPackId: number;

  @ViewColumn({ name: 'MOVEMENT_DEPARTURE_PACK_ID' })
  movementDeparturePackId: number;

  @ViewColumn({ name: 'ARRIVAL_DATE' })
  arrivalDate: Date;

  @ViewColumn({ name: 'DEPARTURE_DATE' })
  departureDate: Date;

  @ViewColumn({ name: 'FROM_DEPARTMENT_ID' })
  fromDepartmentId: number;

  @ViewColumn({ name: 'FROM_DEPARTMENT_NAME' })
  fromDepartmentName: string;

  @ViewColumn({ name: 'TO_DEPARTMENT_ID' })
  toDepartmentId: number;

  @ViewColumn({ name: 'TO_DEPARTMENT_NAME' })
  toDepartmentName: string;

  @ViewColumn({ name: 'ADMINISTRATIVE_DECISION_ID' })
  administrativeDecisionId: number;

  @ViewColumn({ name: 'ADMINISTRATIVE_DECISION_NUMBER' })
  administrativeDecisionNumber: string;

  @ViewColumn({ name: 'DECISION_TYPE_ID' })
  decisionTypeId: number;

  @ViewColumn({ name: 'DECISION_TYPE_NAME' })
  decisionTypeName: string;

  @ViewColumn({ name: 'MOVEMENT_TYPE_ID' })
  movementTypeId: number;

  @ViewColumn({ name: 'MOVEMENT_TYPE_NAME' })
  movementTypeName: string;

  @ViewColumn({ name: 'NUMBER_OF_PRISONERS' })
  numberOfPrisoners: number;

  @ViewColumn({ name: 'PASSWORD' })
  password: string;

  @ViewColumn({ name: 'OFFICER_ID' })
  officerId: number;

  @ViewColumn({ name: 'OFFICER_NAME' })
  officerName: string;

  @ViewColumn({ name: 'EMPLOYEE_CODE' })
  employeeCode: string;

  @ViewColumn({ name: 'EMPLOYEE_NAME' })
  employeeName: string;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;
  
  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;


  static getTableFields() {
    return {
      movementTypeName: { header: 'Шилжилт хөдөлгөөний төрөл', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      administrativeDecisionNumber: { header: 'Шийдвэрийн дугаар', type: 'string', sortable: true, filterable: true, width: 'w-60' },
      decisionTypeName: { header: 'Шийдвэрийн төрөл', type: 'string', sortable: true, filterable: true, width: 'w-72' },
      fromDepartmentName: { header: 'Хаанаас', type: 'string', sortable: true, filterable: true, width: 'w-96' },
      toDepartmentName: { header: 'Хаашаа', type: 'string', sortable: true, filterable: true, width: 'w-96' },
      departureDate: { header: 'Шилжин явсан огноо', type: 'date', sortable: true, filterable: true, width: 'w-60' },
      arrivalDate: { header: 'Шилжин ирсэн огноо', type: 'date', sortable: true, filterable: true, width: 'w-60' },
      wfmStatusName: { header: 'Төлөв', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      numberOfPrisoners: { header: 'Хоригдогсодын тоо', type: 'number', sortable: true, filterable: false, width: 'w-48' },
      employeeName: { header: 'Авч явсан А.Х нэр', type: 'string', sortable: true, filterable: true, width: 'w-60' },
      officerName: { header: 'Авч явсан А.Х нэр /бусад/', type: 'string', sortable: true, filterable: true, width: 'w-60' },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', sortable: true, filterable: true, width: 'w-60' },
    };
  }
}
