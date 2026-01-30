import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_ADDRESS_TYPE')
export class PriInfoAddressType{

  @PrimaryGeneratedColumn({ name: "ADDRESS_TYPE_ID" })
  addressTypeId: number;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "NAME" })
  name: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: "DISPLAY_INDEX" })
  displayIndex: number;

  constructor(item: Partial<PriInfoAddressType>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      addressTypeId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      displayIndex: { header: 'displayIndex', type: 'number', sortable: true, filterable: false, width: 'w-16' },
    };
  }
}