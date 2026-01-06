import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntBase } from '../entBase.entity';

@Entity('UM_ROLE')
export class UmRole extends EntBase{

  @PrimaryGeneratedColumn({ name: "ROLE_ID" })
  roleId: number;

  @Column({ name: "ROLE_CODE" })
  roleCode: string;

  @Column({ name: "ROLE_NAME" })
  roleName: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  constructor(item: Partial<UmRole>) {
    super();
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      roleId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      roleCode: { header: 'Дүрийн код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      roleName: { header: 'Дүрийн нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
    };
  }
}