import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_TRANSACTION_TYPE')
export class PriInfoTransactionType{

  @PrimaryGeneratedColumn({ name: "TRANSACTION_TYPE_ID" })
  transactionTypeId: number;

  @Column({ name: "NAME" })
  name: string;

  constructor(item: Partial<PriInfoTransactionType>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      transactionTypeId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
    };
  }
}