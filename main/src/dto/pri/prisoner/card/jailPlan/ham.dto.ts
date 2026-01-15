import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanHamDto {

    @Expose({ name: 'JAIL_PLAN_PARTICIPANT_ID' })
    jailPlanParticipantId: number;

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: number;

    @Expose({ name: 'PERSON_ID' })
    personId: number;

    @Expose({ name: 'STATE_REG_NUMBER' })
    stateRegNumber: string;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    @Expose({ name: 'LAST_NAME' })
    lastName: string;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;
}