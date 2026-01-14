import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanFineDto {

    @Expose({ name: 'JAIL_PLAN_ID' })
    jailPlanId: string;

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'FINE_AMOUNT' })
    fineAmount: number;

    @Expose({ name: 'FINE_TYPE_NAME' })
    fineTypeName: string;
}