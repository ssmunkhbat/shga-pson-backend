import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { EntBase } from './entBase.entity';

@Entity('USER_KEY')
export class UserKey extends EntBase{

  @PrimaryGeneratedColumn({ name: "ID" })
  id: number;

  @Column({ name: "USER_INFO_ID" })
  userInfoId: number;

  @Column({ name: "POSITION_ID" })
  positionId: number;


  @Column({ name: "DEPARTMENT_ID" })
  departmentId: number;

  @Column({ name: "USER_NAME" })
  userName: string;

  @Column({ name: "PASSWORD" })
  password: string;

  @Column({ name: "ROUND_ID" })
  roundId: number;

  @Column({ name: "LAST_ACTIVE" })
  lastActive: Date;

  @Column({ name: "LAST_LOGIN" })
  lastLogin: Date;

  @Column({ name: "PASS_CHANGED", default: false })
  passChanged: boolean;

  constructor(item: Partial<UserKey>) {
    super();
    Object.assign(this, item)
  }

  static getTableFields() {
    return {
      id: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      userName: { header: 'Хэрэглэгчийн Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      createdDate: { header: 'Бүртгэсэн Огноо', type: 'string', sortable: true, filterable: true, width: 'w-40' },
    };
  }
}