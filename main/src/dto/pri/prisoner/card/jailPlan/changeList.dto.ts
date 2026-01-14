import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanChangeListDto {

    @Expose({ name: 'BEGIN_DATE' })
    beginDate: string;

    @Expose({ name: 'DECISION_TYPE_NAME' })
    decisionTypeName: string;

    @Expose({ name: 'DECISION_DATE' })
    decisionDate: string;

    @Expose({ name: 'DECISION_NUMBER' })
    decisionNumber: string;

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'JAIL_PLAN_CHANGE_ID' })
    jailPlanChangeId: number;

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: number;

    @Expose({ name: 'NAME' })
    name: string;

    dtl: any[];
}