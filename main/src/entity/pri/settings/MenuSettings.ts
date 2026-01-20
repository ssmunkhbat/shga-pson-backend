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
}