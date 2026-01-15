import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardBonusDayDto {

    @Expose({ name: 'BONUS_DAY_TYPE_ID' })
    bonusDayTypeId: number;

    @Expose({ name: 'DATE_OF_BONUS' })
    dateOfBonus: Date;

    @Expose({ name: 'DECISION_NUMBER' })
    decisionNumber: string;

    @Expose({ name: 'DAYS' })
    days: number;
}