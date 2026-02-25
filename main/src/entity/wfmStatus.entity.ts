import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('WFM_STATUS')
export class WfmStatus {
  @PrimaryColumn({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @Column({ name: 'WFM_STATUS_NAME' })
  wfmStatusName: string;

  @Column({ name: 'WFM_STATUS_GROUP_ID' })
  wfmStatusGroupId: number;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: 'WFM_STATUS_COLOR' })
  wfmStatusColor: string;

  @Column({ name: 'WFM_STATUS_BG_COLOR' })
  wfmStatusBgColor: string;

  @Column({ name: "IS_CONFIRMED", default: true })
  isConfirmed: boolean;

  @Column({ name: 'WFM_STATUS_CODE' })
  wfmStatusCode: string;

  @Column({ name: 'CREATED_USER_ID' })
  createdUserId: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'MODIFIED_USER_ID' })
  modifiedUserId: number;

  @Column({ name: 'MODIFIED_DATE' })
  modifiedDate: Date;

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      wfmStatusId: { header: 'wfmStatusId', type: 'number', sortable: false, filterable: false, width: 'w-16' },
      wfmStatusGroupId: { header: 'wfmStatusGroupId', type: 'number', sortable: false, filterable: true, width: 'w-16' },
      wfmStatusCode: { header: 'Код', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      wfmStatusName: { header: 'Нэр', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      wfmStatusColor: { header: 'Текст өнгө', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      wfmStatusBgColor: { header: 'Background өнгө', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      isConfirmed: { header: 'isConfirmed', type: 'boolean', sortable: false, filterable: true, width: 'w-48' },
      isActive: { header: 'Идэвхтэй эсэх', type: 'boolean', sortable: false, filterable: true, width: 'w-16' },
    };
  }
  
  /*
    * Form-ын талбаруудын мэдээлэл
  */
  static getFormFields() {
    return {
      wfmStatusId: { label: 'wfmStatusId', type: 'number', isRequired: false, column: 1, hidden: true, isPrimary: true },
      wfmStatusGroupId: { label: 'wfmStatusGroupId', type: 'number', isRequired: true, column: 1, hidden: false },
      wfmStatusCode: { label: 'Код', type: 'string', isRequired: true, column: 1 },
      wfmStatusName: { label: 'Нэр', type: 'string', isRequired: true, column: 1 },
      wfmStatusColor: { label: 'Текст өнгө', type: 'string', isRequired: false, column: 2 },
      wfmStatusBgColor: { label: 'Background өнгө', type: 'string', isRequired: false, column: 2 },
      isActive: { label: 'Идэвхтэй эсэх', type: 'boolean', isRequired: true, column: 2},
    };
  }
}