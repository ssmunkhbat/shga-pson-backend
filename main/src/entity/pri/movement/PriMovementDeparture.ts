
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'KHORIGDOL_VT', name: 'PRI_MOVEMENT_DEPARTURE' })
export class PriMovementDeparture {
  @PrimaryColumn({ name: 'MOVEMENT_DEPARTURE_ID' })
  movementDepartureId: number;

  @Column({ name: 'MOVEMENT_DEPARTURE_PACK_ID' })
  movementDeparturePackId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'MOVEMENT_TYPE_PRISONER_ID', nullable: true })
  reasonId: number;

  @Column({ name: 'DEPARTMENT_REGIME_ID', nullable: true })
  regimenId: number;

  @Column({ name: 'REGIME_CLASS_ID', nullable: true })
  classId: number;

  @Column({ name: 'DESCRIPTION', nullable: true })
  description: string; // Additional Info

  // @Column({ name: 'IS_SPECIAL_ATTENTION', nullable: true })
  // isSpecialAttention: number;

  @Column({ name: 'CREATED_DATE', type: 'date', default: () => 'SYSDATE' })
  createdDate: Date;

  constructor(item: Partial<PriMovementDeparture>) {
    Object.assign(this, item)
  }
}
