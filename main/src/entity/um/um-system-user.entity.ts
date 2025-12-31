import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntBase } from '../entBase.entity';

@Entity('UM_SYSTEM_USER')
export class UmSystemUser extends EntBase{

  @PrimaryGeneratedColumn({ name: "USER_ID" })
  userId: number;

  @Column({ name: "USERNAME" })
  userName: string;

  @Column({ name: "PASSWORD_HASH" })
  passwordHash: string;

  constructor(item: Partial<UmSystemUser>) {
    super();
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      id: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      userName: { header: 'Хэрэглэгчийн Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
    };
  }
}