import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_BOOK_TYPE')
export class PriInfoBookType{

  @PrimaryGeneratedColumn({ name: "BOOK_TYPE_ID" })
  bookTypeId: number;
  
  @Column({ name: "TRANSACTION_TYPE_ID" })
  transactionTypeId: number;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "NAME" })
  name: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  constructor(item: Partial<PriInfoBookType>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      bookTypeId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      transactionTypeId: { header: 'transactionTypeId', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-24' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
    };
  }
}