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
      wfmStatusId: { header: 'wfmStatusId', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      wfmStatusCode: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      wfmStatusName: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      WFM_STATUS_COLOR: { header: 'Өнгө', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      isConfirmed: { header: 'isConfirmed', type: 'boolean', sortable: true, filterable: true, width: 'w-48' },
    };
  }
}