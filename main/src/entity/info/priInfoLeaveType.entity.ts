import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_LEAVE_TYPE')
export class PriInfoLeaveType {

  @PrimaryGeneratedColumn({ name: "LEAVE_TYPE_ID" })
  leaveTypeId: number;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "NAME" })
  name: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: "DISPLAY_INDEX" })
  displayIndex: number;

  constructor(item: Partial<PriInfoLeaveType>) {
    Object.assign(this, item)
  }
  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      leaveTypeId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      displayIndex: { header: 'Эрэмбэ', type: 'number', sortable: true, filterable: false, width: 'w-16' },
    };
  }
}