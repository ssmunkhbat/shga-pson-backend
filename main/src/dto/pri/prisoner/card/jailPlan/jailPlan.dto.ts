import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanDto {

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: number;

    @Expose({ name: 'CRIME_TYPE_NAME' })
    crimeTypeName: string;

    @Expose({ name: 'DECISION' })
    decision: string;

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'INTENTION' })
    intention: string;

    @Expose({ name: 'IS_UNITED' })
    isUnited: number;
}