import { Column, ViewEntity } from 'typeorm';

@ViewEntity('PRI_PRISONER_ACCOUNT_BOOK_VIEW')
export class PriPrisonerAccountBookView {

  @Column({ name: "BOOK_ID" })
  bookId: number;

  @Column({ name: "PRISONER_ID" })
  prisonerId: number;

  @Column({ name: "TRANSACTION_TYPE_ID" })
  transactionTypeId: number;

  @Column({ name: "TRANSACTION_TYPE_NAME" })
  transactionTypeName: string;

  @Column({ name: "BOOK_TYPE_ID" })
  bookTypeId: number;

  @Column({ name: "BOOK_TYPE_NAME" })
  bookTypeName: string;

  @Column({ name: "BOOK_DATE" })
  bookDate: Date;

  @Column({ name: "DEBIT_AMOUNT" })
  debitAmount: number;

  @Column({ name: "CREDIT_AMOUNT" })
  creditAmount: number;

  @Column({ name: "DESCRIPTION" })
  description: string;

  @Column({ name: "CREATED_DATE", default: new Date() })
  createdDate: Date;

  @Column({ name: "CREATED_EMPLOYEE_KEY_ID" })
  createdEmployeeKeyId: number;

  @Column({ name: "CREATED_EMPLOYEE_CODE" })
  createdEmployeeCode: number;

  @Column({ name: "CREATED_EMPLOYEE_NAME" })
  createdEmployeeName: string;

  constructor(item: Partial<PriPrisonerAccountBookView>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      // bookId: { header: 'Хоригдогчийн дугаар', type: 'string', sortable: false, filterable: true, width: 'w-24' },
      bookTypeName: { header: 'Төрөл', type: 'string', sortable: false, filterable: true, width: 'w-24' },
      bookDate: { header: 'Огноо', type: 'date', sortable: false, filterable: true, width: 'w-24' },
      debitAmount: { header: 'Орлогын дүн', type: 'number', sortable: false, filterable: true, width: 'w-24' },
      creditAmount: { header: 'Зарлагын дүн', type: 'number', sortable: false, filterable: true, width: 'w-24' },
      description: { header: 'Гүйлгээний утга', type: 'string', sortable: false, filterable: true, width: 'w-24' },
      createdDate: { header: 'Бүртгэсэн огноо', type: 'date', sortable: false, filterable: true, width: 'w-24' },
      createdEmployeeName: { header: 'Бүртгэсэн ажилтан', type: 'string', sortable: false, filterable: true, width: 'w-24' },
    };
  }
}