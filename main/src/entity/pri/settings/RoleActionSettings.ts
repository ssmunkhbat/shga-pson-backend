import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_SETTINGS_ROLE_ACTION')
export class RoleActionSettings {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'ROLE_ID' })
  roleId: number;

  @Column({ name: 'MENU_ID' })
  menuId: number;

  @Column({ name: 'ACTION_ID' })
  actionId: number;

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