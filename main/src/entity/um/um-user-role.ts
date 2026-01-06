import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { EntBase } from '../entBase.entity';
import { UmRole } from './umRole';
import { UmSystemUser } from './um-system-user.entity';

@Entity('UM_USER_ROLE')
export class UmUserRole extends EntBase{

  @PrimaryGeneratedColumn({ name: "ID" })
  id: number;

  @Column({ name: "USER_ID" })
  user_id: number;
  
  @OneToOne(() => UmSystemUser, (u) => u.userId)
  @JoinColumn({name: 'USER_ID'})
  user: UmSystemUser;

  @Column({ name: "ROLE_ID" })
  roleId: number;
  
  @OneToOne(() => UmRole, (r) => r.roleId)
  @JoinColumn({name: 'ROLE_ID'})
  role: UmRole;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  constructor(item: Partial<UmUserRole>) {
    super();
    Object.assign(this, item)
  }

  // /*
  //   * Table-ын талбаруудын мэдээлэл
  // */
  // static getTableFields() {
  //   return {
  //     id: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
  //     userName: { header: 'Хэрэглэгчийн Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
  //     createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
  //   };
  // }
}