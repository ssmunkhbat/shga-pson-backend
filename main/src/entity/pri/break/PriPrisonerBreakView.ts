
import { ViewEntity, ViewColumn, OneToOne, JoinColumn } from 'typeorm';
import { WfmStatus } from 'src/entity/wfmStatus.entity';

@ViewEntity({
  name: 'PRI_PRISONER_BREAK_VIEW',
  synchronize: false,
})
export class PriPrisonerBreakView {
  @ViewColumn({ name: 'PRISONER_BREAK_ID' })
  prisonerBreakId: number;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'BREAK_DATE' })
  breakDate: Date;

  @ViewColumn({ name: 'DESCRIPTION' })
  description: string;

  @ViewColumn({ name: 'CREATED_DATE' })
  createdDate: Date;

  @ViewColumn({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @ViewColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;
  
  @OneToOne(() => WfmStatus, (ws) => ws.wfmStatusId)
  @JoinColumn({name: 'WFM_STATUS_ID'})
  wfmStatus: WfmStatus;

  @ViewColumn({ name: 'FOUND_DATE' })
  foundDate: Date;


  @ViewColumn({ name: 'IS_TRACKING' })
  isTracking: number;

  @ViewColumn({ name: 'HAS_REWARD' })
  hasReward: number;

  @ViewColumn({ name: 'REWARD_AMOUNT' })
  rewardAmount: number;

  @ViewColumn({ name: 'CONTACT_INFO' })
  contactInfo: string;

  @ViewColumn({ name: 'IS_ACTIVE' })
  isActive: number;

  @ViewColumn({ name: 'DELETED' })
  deleted: number;

  @ViewColumn({ name: 'PRISONER_ID' })
  prisonerId: number;

  @ViewColumn({ name: 'PRISONER_NUMBER' })
  prisonerNumber: string;

  @ViewColumn({ name: 'NICKNAME' })
  nickname: string;

  @ViewColumn({ name: 'PERSON_ID' })
  personId: number;

  @ViewColumn({ name: 'STATE_REG_NUMBER' })
  stateRegNumber: string;

  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'LAST_NAME' })
  lastName: string;

  @ViewColumn({ name: 'DEPARTMENT_NAME' })
  departmentName: string;

  static getTableFields() {
    return {
      prisonerNumber: { header: 'Хоригдогчийн дугаар', type: 'string', width: 150, sortable: true, filterable: true },
      stateRegNumber: { header: 'Регистрийн дугаар', type: 'string', width: 150, sortable: true, filterable: true },
      lastName: { header: 'Эцэг/эхийн нэр', type: 'string', width: 150, sortable: true, filterable: true },
      firstName: { header: 'Өөрийн нэр', type: 'string', width: 150, sortable: true, filterable: true },
      nickname: { header: 'Хоч', type: 'string', width: 150, sortable: true, filterable: true },
      departmentName: { header: 'Хэлтэс тасгийн нэр', type: 'string', width: 200, sortable: true, filterable: true },
      breakDate: { header: 'Оргосон огноо', type: 'date', width: 150, sortable: true, filterable: true },
      wfmStatus: {
        header: 'Төлөв',
        type: 'refstatus',
        refField: 'wfmStatus.wfmStatusName', refListName: 'wfmStatusList', refListFilter: 'filters=[{"field":"WFM_STATUS_GROUP_ID","value":100400}]', refColorField: 'wfmStatus.wfmStatusColor', refBgColorField: 'wfmStatus.wfmStatusBgColor',
        sortable: false, filterable: true, width: 'w-16'
      },
      foundDate: { header: 'Олдсон огноо', type: 'date', width: 150, sortable: true, filterable: true },
      isTracking: { header: 'Эрэн сурвалжилж байгаа эсэх', type: 'boolean', width: 100, sortable: true, filterable: true },
      contactInfo: { header: 'Холбоо барих утас', type: 'string', width: 200, sortable: true, filterable: true },
      hasReward: { header: 'Шагналын сантай эсэх', type: 'boolean', width: 100, sortable: true, filterable: true },
      rewardAmount: { header: 'Шагналын сан', type: 'number', width: 150, sortable: true, filterable: true },
    };
  }
}
