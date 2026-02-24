import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_SETTINGS_MENU')
export class MenuSettings {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'META_DATA_ID' })
  metaDataId: number;

  @Column({ name: 'PARENT_ID' })
  parentId: number;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "TYPE" })
  type: string;

  @Column({ name: "NAME" })
  name: string;

  @Column({ name: "ICON" })
  icon: string;

  @Column({ name: "ORDER_NUM" })
  orderNum: number;

  @Column({ name: "PATH" })
  path: string;

  @Column({ name: 'IS_ACTIVE', default: 1 })
  isActive: number;

  @Column({ name: 'CREATED_DATE', default: () => new Date() })
  createdDate: Date;

  @Column({ name: 'CREATED_USER_ID' })
  createdUserId: number;

  @Column({ name: 'MODIFIED_DATE', type: 'date', nullable: true })
  modifiedDate: Date;

  @Column({ name: 'MODIFIED_USER_ID', nullable: true })
  modifiedUserId: number;

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      // id: { header: 'ID', type: 'number', sortable: false, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      type: { header: 'Төрөл', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      name: { header: 'Нэр', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      path: { header: 'Path', type: 'string', sortable: false, filterable: true, width: 'w-48' },
      orderNum: { header: 'orderNum', type: 'number', sortable: false, filterable: false, width: 'w-16' },
    };
  }

  /*
    * Form-ын талбаруудын мэдээлэл
  */
  static getFormFields() {
    return {
      id: { label: 'id', type: 'number', isRequired: false, column: 1, hidden: true },
      metaDataId: { label: 'metaDataId', type: 'number', isRequired: false, column: 1, hidden: true },
      type: { label: 'Төрөл', type: 'type', isRequired: true, column: 1 },
      code: { label: 'Код', type: 'string', isRequired: true, column: 1 },
      name: { label: 'Нэр', type: 'string', isRequired: true, column: 1 },
      path: { label: 'path', type: 'string', isRequired: false, column: 2 },
      orderNum: { label: 'Эрэмбэ', type: 'number', isRequired: false, column: 2 },
      isActive: { label: 'Идэвхтэй эсэх', type: 'boolean', isRequired: true, column: 2},
    };
  }
}