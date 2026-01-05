
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'KHORIGDOL_VT', name: 'PRI_MOVEMENT_DEPARTURE_PACK' })
export class PriMovementDeparturePack {
  @PrimaryColumn({ name: 'MOVEMENT_DEPARTURE_PACK_ID' })
  movementDeparturePackId: number;

  @Column({ name: 'DEPARTURE_DATE', type: 'date', nullable: true })
  departureDate: Date;

  @Column({ name: 'FROM_DEPARTMENT_ID', nullable: true })
  fromDepartmentId: number;

  @Column({ name: 'TO_DEPARTMENT_ID', nullable: true })
  toDepartmentId: number;

  @Column({ name: 'DECISION_ID', nullable: true })
  decisionId: number;

  @Column({ name: 'OFFICER_ID', nullable: true })
  officerId: number;

  @Column({ name: 'OFFICER_NAME', nullable: true })
  officerName: string; // Used for "Other" officer or textual name

  @Column({ name: 'GRANT_PASSWORD', nullable: true })
  grantPassword: string;

  @Column({ name: 'WFM_STATUS_ID', nullable: true })
  wfmStatusId: number;

  @Column({ name: 'MOVEMENT_TYPE_ID', nullable: true })
  movementTypeId: number;

  @Column({ name: 'NUMBER_OF_PRISONERS', nullable: true })
  numberOfPrisoners: number;

  @Column({ name: 'CREATED_BY', nullable: true })
  createdBy: number;

  @Column({ name: 'CREATED_DATE', type: 'date', default: () => 'SYSDATE' })
  createdDate: Date;

  @Column({ name: 'IS_ACTIVE', default: 1 })
  isActive: number;
}
