import { BasePerson } from 'src/entity/base/basePerson';
import { UmSystemUser } from 'src/entity/um/um-system-user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

@Entity('PRI_EMPLOYEE')
export class PriEmployee {

  @PrimaryGeneratedColumn({ name: "EMPLOYEE_ID" })
  employeeId: number;

  @Column({ name: "PERSON_ID" })
  personId: number;

  @OneToOne(() => BasePerson, (bp) => bp.personId)
  @JoinColumn({name: 'PERSON_ID'})
  person: BasePerson;

  @Column({ name: "EMPLOYEE_CODE" })
  employeeCode: string;

  @Column({ name: "USER_ID" })
  userId: number;

  @OneToOne(() => UmSystemUser, (bp) => bp.userId)
  @JoinColumn({name: 'USER_ID'})
  user: UmSystemUser;

  @Column({ name: "IS_ACTIVE" })
  isActive: boolean;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  constructor(item: Partial<PriEmployee>) {
    Object.assign(this, item)
  }

  // /*
  //   * Table-ын талбаруудын мэдээлэл
  // */
  // static getTableFields() {
  //   return {
  //     prisonerId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
  //     nickname: { header: 'Хэрэглэгчийн Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
  //     createdDate: { header: 'Бүртгэсэн Огноо', type: 'date', sortable: true, filterable: true, width: 'w-40' },
  //   };
  // }
}