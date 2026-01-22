
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'KHORIGDOL_VT', name: 'PRI_MOVEMENT_ARRIVAL' })
export class PriMovementArrival {
  @PrimaryColumn({ name: 'MOVEMENT_ARRIVAL_ID' })
  movementArrivalId: number;

  @Column({ name: 'MOVEMENT_ARRIVAL_PACK_ID' })
  movementArrivalPackId: number;

  @Column({ name: 'MOVEMENT_DEPARTURE_ID' })
  movementDepartureId: number;

  @Column({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @Column({ name: 'CREATED_DATE', type: 'date', default: () => 'SYSDATE' })
  createdDate: Date;
}
