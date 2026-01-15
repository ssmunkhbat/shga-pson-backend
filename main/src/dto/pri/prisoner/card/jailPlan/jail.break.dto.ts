import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanJailBreakDto {

    @Expose({ name: 'BREAK_DATE' })
    breakDate: Date;

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;

    @Expose({ name: 'WFM_STATUS_NAME' })
    wfmStatusName: string;

    @Expose({ name: 'FOUND_DATE' })
    foundDate: Date;
}