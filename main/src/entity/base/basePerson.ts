import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { EntBase } from '../entBase.entity';
import { PriEmployee } from '../pri/employee/priEmployee'

@Entity('BASE_PERSON')
export class BasePerson extends EntBase{

  @PrimaryGeneratedColumn({ name: "PERSON_ID" })
  personId: number;

  @Column({ name: "FIRST_NAME" })
  firstName: string;

  @Column({ name: "LAST_NAME" })
  lastName: string;

  @Column({ name: "DATE_OF_BIRTH" })
  dateOfBirth: Date;

  @Column({ name: "STATE_REG_NUMBER" })
  stateRegNumber: string;

  @Column({ name: "COUNTRY_ID" })
  countryId: number;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: "EMPLOYEE_ID" })
  employeeId: number;

  @OneToOne(() => PriEmployee, (employee) => employee.person)
  employee: PriEmployee;

  @Column({ name: "FAMILY_NAME" })
  familyName: string;

  @Column({ name: "GENDER_ID" })
  genderId: number;

  @Column({ name: "EDUCATION_ID" })
  educationId: number;

  @Column({ name: "NATIONALITY_ID" })
  nationalityId: number;

  @Column({ name: "POSITION" })
  position: string;

  @Column({ name: "PROFESSION" })
  profession: string;

  @Column({ name: "FAMILY_MEMBER_COUNT" })
  familyMemberCount: number;

  @Column({ name: "MARITAL_STATUS_ID" })
  maritalStatusId: number;

  @Column({ name: "PASSPORT_NUMBER" })
  passportNumber: string;

  @Column({ name: "LABOR_DESCRIPTION" })
  laborDescription: string;

  @Column({ name: "IS_POSITION" })
  isPosition: number;

  @Column({ name: "IMAGE_URL" })
  imageUrl: string;

  constructor(item: Partial<BasePerson>) {
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