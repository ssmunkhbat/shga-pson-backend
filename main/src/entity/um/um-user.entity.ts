import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('UM_USER')
export class UmUser {

  @PrimaryGeneratedColumn({ name: "USER_ID" })
  userId: number;

  @Column({ name: "USERNAME" })
  userName: string;
    
  @Column({ name: "SYSTEM_USER_ID" })
  systemUserId: number;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  @Column({ name: "CREATED_USER_ID" })
  createdUserId: number;

  @Column({ name: "MODIFIED_DATE" })
  modifiedDate: Date;

  @Column({ name: "MODIFIED_USER_ID" })
  modifiedUserId: number;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  constructor(item: Partial<UmUser>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      userName: { header: 'Хэрэглэгчийн Нэр', type: 'string', sortable: true, filterable: true, width: 'w-24' },
    };
  }
}