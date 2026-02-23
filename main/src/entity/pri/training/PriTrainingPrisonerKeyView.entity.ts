import { ViewColumn, ViewEntity } from "typeorm";
@ViewEntity('PRI_TRAINING_PRISONER_KEY_VIEW')
export class PriTrainingPrisonerKeyView {

  @ViewColumn({ name: 'TRAINING_PRISONER_ID' })
  trainingPrisonerId: number;

  @ViewColumn({ name: 'TRAINING_ID' })
  trainingId: number;

  @ViewColumn({ name: 'PRISONER_KEY_ID' })
  prisonerKeyId: number;

  @ViewColumn({ name: 'PRISONER_NUMBER' })
  prisonerNumber: string;

  @ViewColumn({ name: 'STATE_REG_NUMBER' })
  stateRegNumber: string;

  @ViewColumn({ name: 'LAST_NAME' })
  lastName: string;

  @ViewColumn({ name: 'FIRST_NAME' })
  firstName: string;

  @ViewColumn({ name: 'NICKNAME' })
  nickname: string;
  
}
