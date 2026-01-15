import { Expose } from '@nestjs/class-transformer';

export class PriJailPanDetailDto {

    @Expose({ name: 'REGIME_NAME' })
    regimeName: string;

    @Expose({ name: 'JAIL_PLAN_DETAIL_ID' })
    jailPlanDetailId: number;

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: number;

    @Expose({ name: 'CRIMINAL_CASE_ID' })
    criminalCaseId: number;

    @Expose({ name: 'DEPARTMENT_REGIME_ID' })
    departmentRegimeId: number;

    @Expose({ name: 'WFM_STATUS_ID' })
    wfmStatusId: number;

    @Expose({ name: 'JAIL_BEGIN_DATE' })
    jailBeginDate: Date;

    @Expose({ name: 'JAIL_YEARS' })
    jailYears: number;

    @Expose({ name: 'JAIL_MONTHS' })
    jailMonths: number;

    @Expose({ name: 'JAIL_DAYS' })
    jailDays: number;

    @Expose({ name: 'JAIL_END_DATE' })
    jailEndDate: Date;

    @Expose({ name: 'CREATED_DATE' })
    createdDate: Date;

    @Expose({ name: 'IS_ACTIVE' })
    isActive: boolean;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    @Expose({ name: 'LAST_NAME' })
    lastName: string;

    @Expose({ name: 'DEPARTMENT_REGIME_CLASS_ID' })
    departmentRegimeClassId: number;
}