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
      userName: { header: 'Хэрэглэгчийн Нэр', type: 'string', sortable: true, filterable: true, width: 'w-24' },
      'employeeCode': { header: 'Албан хаагчийн код', type: 'ref', refField: 'person.employee.employeeCode', sortable: true, filterable: true, width: 'w-24' },
      'stateRegNumber': { header: 'Регистр', type: 'ref', refField: 'person.stateRegNumber', sortable: true, filterable: true, width: 'w-24' },
      'lastName': { header: 'Эцэг/эх-ийн нэр', type: 'ref', refField: 'person.lastName', sortable: true, filterable: true, width: 'w-24' },
      'firstName': { header: 'Өөрийн нэр', type: 'ref', refField: 'person.firstName', sortable: true, filterable: true, width: 'w-24' },
      'militaryRankId': { header: 'Цол', type: 'ref', refField: 'person.employee.employeeKey.militaryRank.name', sortable: true, filterable: true, width: 'w-24' },
      'positionTypeId': { header: 'Тушаалын төрөл', type: 'ref', refField: 'person.employee.employeeKey.positionType.name', sortable: true, filterable: true, width: 'w-24' },
      'departmentId': { header: 'Хорих анги, албадын нэр', type: 'ref', refField: 'person.employee.employeeKey.department.name', sortable: true, filterable: true, width: 'w-24' },
    };
  }
}