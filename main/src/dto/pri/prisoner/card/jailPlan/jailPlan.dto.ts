import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanDto {

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: string;

    @Expose({ name: 'CRIME_TYPE_NAME' })
    crimeTypeName: string;

    @Expose({ name: 'DECISION' })
    decision: string;

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'IS_UNITED' })
    isUnited: boolean;
}