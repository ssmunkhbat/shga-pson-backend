import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PRI_INFO_MILITARY_RANK')
export class PriInfoMilitaryRank{

  @PrimaryGeneratedColumn({ name: "MILITARY_RANK_ID" })
  militaryRankId: number;

  @Column({ name: "CODE" })
  code: string;

  @Column({ name: "NAME" })
  name: string;

  @Column({ name: "IS_ACTIVE", default: true })
  isActive: boolean;

  constructor(item: Partial<PriInfoMilitaryRank>) {
    Object.assign(this, item)
  }

  /*
    * Table-ын талбаруудын мэдээлэл
  */
  static getTableFields() {
    return {
      militaryRankId: { header: 'ID', type: 'number', sortable: true, filterable: false, width: 'w-16' },
      code: { header: 'Код', type: 'string', sortable: true, filterable: true, width: 'w-48' },
      name: { header: 'Нэр', type: 'string', sortable: true, filterable: true, width: 'w-48' },
    };
  }
}