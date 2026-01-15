import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanForceWorkDto {

    @Expose({ name: 'WORK_HOURS' })
    workHours: number;

    @Expose({ name: 'DESCRIPTION' })
    description: string;
}