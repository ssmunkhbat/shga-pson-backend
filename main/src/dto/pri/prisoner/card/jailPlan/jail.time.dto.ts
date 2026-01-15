import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanJailTimeDto {

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: number;

    @Expose({ name: 'JAIL_BEGIN_DATE' })
    jailBeginDate: Date;
}