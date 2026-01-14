import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanDetailDto {

    @Expose({ name: 'DEPARTMENT_REGIME_NAME' })
    departmentRegimeName: string;

    @Expose({ name: 'JAIL_DAYS' })
    jailDays: number;

    @Expose({ name: 'JAIL_MONTHS' })
    jailMonths: number;

    @Expose({ name: 'JAIL_PLAN_DETAIL_ID' })
    jailPlanDetailId: number;

    @Expose({ name: 'JAIL_YEARS' })
    jailYears: number;
}