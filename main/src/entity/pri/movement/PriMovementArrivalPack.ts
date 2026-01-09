
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'KHORIGDOL_VT', name: 'PRI_MOVEMENT_ARRIVAL_PACK' })
export class PriMovementArrivalPack {
  @PrimaryColumn({ name: 'MOVEMENT_ARRIVAL_PACK_ID' })
  movementArrivalPackId: number;

  @Column({ name: 'MOVEMENT_DEPARTURE_PACK_ID' })
  movementDeparturePackId: number;

  @Column({ name: 'ARRIVAL_DATE', type: 'date', default: () => 'SYSDATE' })
  arrivalDate: Date;

  @Column({ name: 'CREATED_DATE', type: 'date', default: () => 'SYSDATE' })
  createdDate: Date;
}
