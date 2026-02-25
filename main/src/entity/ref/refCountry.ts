import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('REF_COUNTRY')
export class RefCountry{

  @PrimaryGeneratedColumn({ name: "COUNTRY_ID" })
  countryId: number;

  @Column({ name: "COUNTRY_CODE" })
  countryCode: string;

  @Column({ name: "COUNTRY_NAME" })
  countryName: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: "DISPLAY_ORDER" })
  displayOrder: number;

  constructor(item: Partial<RefCountry>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      countryId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      countryCode: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      countryName: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      displayOrder: { header: 'displayOrder', type: 'number', sortable: true, filterable: false, width: 'w-16' },
    };
  }
  
  /*
    * Form-ын талбаруудын мэдээлэл
  */
  static getFormFields() {
    return {
      countryId: { label: 'ID', type: 'number', isRequired: false, column: 1, hidden: true, isPrimary: true },
      countryCode: { label: 'Код', type: 'string', isRequired: true, column: 1 },
      countryName: { label: 'Нэр', type: 'string', isRequired: true, column: 1 },
      displayOrder: { label: 'Эрэмбэ', type: 'number', isRequired: true, column: 2 },
    };
  }
}