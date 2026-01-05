import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_POSITION_TYPE')
export class PriInfoPositionType{

  @PrimaryGeneratedColumn({ name: "POSITION_TYPE_ID" })
  positionTypeId: number;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "NAME" })
  name: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  @Column({ name: "DEFAULT_ROLE_ID" })
  defaultRoleId: number;

  constructor(item: Partial<PriInfoPositionType>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      positionTypeId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      defaultRoleId: { header: 'defaultRoleId', type: 'number', sortable: true, filterable: false, width: 'w-16' },
    };
  }
}