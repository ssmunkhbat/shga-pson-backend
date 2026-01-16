import { Expose } from '@nestjs/class-transformer';

export class PriJailPanDto {

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: number;

    @Expose({ name: 'JAIL_BEGIN_DATE' })
    jailBeginDate: Date;

    @Expose({ name: 'DAYS_IN_CUSTODY' })
    daysInCustody: number;

    @Expose({ name: 'JAIL_START_DATE' })
    jailStartDate: Date;
}