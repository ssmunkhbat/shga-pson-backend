import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_DISCIPLINE_CELL_BOOK')
export class PriDisciplineCellBook {
  @PrimaryGeneratedColumn({ name: 'DISCIPLINE_CELL_ID' })
  disciplineCellId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'PRISON_CELL_ID' })
  prisonCellId: number;

  @Column({ name: 'REASON' })
  reason: string;

  @Column({ name: 'BEGIN_DATE' })
  beginDate: Date;

  @Column({ name: 'END_DATE' })
  endDate: Date;

  @Column({ name: 'CREATED_DATE' })
  createdDate: Date;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  constructor(item: Partial<PriDisciplineCellBook>) {
    Object.assign(this, item)
  }
}
