import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PRI_PRISONER_BODY_ATTRIBUTE')
export class PriPrisonerBodyAttribute {
  @PrimaryGeneratedColumn({ name: 'PRISONER_BODY_ATTRIBUTE_ID' })
  prisonerBodyAttributeId: number;

  @Column({ name: 'PRISONER_ID' })
  prisonerId: number;

  @Column({ name: 'BODY_ATTRIBUTE_ID' })
  bodyAttributeId: number;

  @Column({ name: 'BODY_ATTRIBUTE_TYPE_ID' })
  bodyAttributeTypeId: number;

  @Column({ name: 'CREATED_EMPLOYEE_KEY_ID' })
  createdEmployeeKeyId: number;

  @Column({ name: 'CREATED_DATE' })
  createdDate: number;

  @Column({ name: 'DESCRIPTION' })
  description: number;

  constructor(item: Partial<PriPrisonerBodyAttribute>) {
    Object.assign(this, item)
  }
}
