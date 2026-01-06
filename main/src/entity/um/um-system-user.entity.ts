import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { EntBase } from '../entBase.entity';
import { BasePerson } from '../base/basePerson';

@Entity('UM_SYSTEM_USER')
export class UmSystemUser {

  @PrimaryGeneratedColumn({ name: "USER_ID" })
  userId: number;

  @Column({ name: "USERNAME" })
  userName: string;

  @Column({ name: "PASSWORD_HASH" })
  passwordHash: string;
    
  @Column({ name: "PERSON_ID" })
  personId: number;

  @OneToOne(() => BasePerson, (p) => p.personId)
  @JoinColumn({name: 'PERSON_ID'})
  person: BasePerson;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  @Column({ name: "CREATED_USER_ID" })
  createdUserId: number;

  @Column({ name: "CHANGE_DATE" })
  changeDate: Date;

  constructor(item: Partial<UmSystemUser>) {
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