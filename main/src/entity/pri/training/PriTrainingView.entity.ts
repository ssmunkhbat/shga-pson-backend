import { WfmStatus } from "src/entity/wfmStatus.entity";
import { JoinColumn, ManyToOne, ViewColumn, ViewEntity } from "typeorm";

@ViewEntity('PRI_TRAINING_VIEW')
export class PriTrainingView {
  @ViewColumn({ name: 'TRAINING_ID' })
  trainingId: number;

  @ViewColumn({ name: 'INFO_TRAINING_ID' })
  infoTrainingId: number;
  
  @ViewColumn({ name: 'DEPARTMENT_ID' })
  departmentId: number;

  @ViewColumn({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @ViewColumn({ name: 'END_DATE' })
  endDate: Date;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'TIMES_A_WEEK' })
  timesAWeek: number;

  @ViewColumn({ name: 'TIME_OF_DAY' })
  timeOfDay: Date;
  
  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'TRAINING_NAME' })
  trainingName: string;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  @ViewColumn({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_CODE' })
  createdEmployeeCode: string;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_NAME' })
  createdEmployeeName: string;

  @ViewColumn({ name: 'TRAINING_PRISONERS_COUNT' })
  trainingPrisonersCount: number;

  @ViewColumn({ name: 'TEACHER_NAME' })
  teacherName: string;
  
  @ManyToOne(() => WfmStatus, (ws) => ws.wfmStatusId)
  @JoinColumn({name: 'WFM_STATUS_ID'})
  wfmStatus: WfmStatus;

  @ViewColumn({ name: 'RANGE_TIME' })
  rangeTime: string;

  static getTableFields() {
    return {
      trainingName: { header: 'Сургалтын төрөл', type: 'string', sortable: true, filterable: true, width: 'w-16' },
      beginDate: { header: 'Эхлэх огноо', type: 'date', sortable: true, filterable: true, width: 'w-48' },
      endDate: { header: 'Дуусах огноо', type: 'date', sortable: true, filterable: true, width: 'w-48' },
      rangeTime: { header: 'Цаг огноо', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      timesAWeek: { header: '7 хоногт', type: 'number', sortable: true, filterable: true, width: 'w-48' },
      teacherName: { header: 'Багш', type: 'string', sortable: true, filterable: true, width: 'w-16' },
      trainingPrisonersCount: { header: 'Оролцогчид', type: 'number', sortable: true, filterable: true, width: 'w-48' },
      wfmStatus: {
        header: 'Төлөв',
        type: 'refstatus',
        refField: 'wfmStatus.wfmStatusName', refListName: 'wfmStatusList', refListFilter: 'filters=[{"field":"WFM_STATUS_GROUP_ID","value":101200}]',
        refColorField: 'wfmStatus.wfmStatusColor', refBgColorField: 'wfmStatus.wfmStatusBgColor',
        sortable: false, filterable: true, width: 'w-16'
      },
      createdEmployeeCode: { header: 'Бүртгэсэн ажилтан код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Үүсгэсэн огноо', type: 'datetime', sortable: true, filterable: true, width: 'w-48' }
    }
  }
}