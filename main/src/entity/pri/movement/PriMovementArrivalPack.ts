
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'KHORIGDOL_VT', name: 'PRI_MOVEMENT_ARRIVAL_PACK' })
export class PriMovementArrivalPack {
  @PrimaryColumn({ name: 'MOVEMENT_ARRIVAL_PACK_ID' })
  movementArrivalPackId: number;

  @Column({ name: 'MOVEMENT_DEPARTURE_PACK_ID' })
  movementDeparturePackId: number;

  @Column({ name: 'ARRIVAL_DATE', type: 'date', default: () => 'SYSDATE' })
  arrivalDate: Date;

  @Column({ name: 'WFM_STATUS_ID' })
  wfmStatusId: number;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID', nullable: true })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE', type: 'date', default: () => 'SYSDATE' })
  createdDate: Date;
}
