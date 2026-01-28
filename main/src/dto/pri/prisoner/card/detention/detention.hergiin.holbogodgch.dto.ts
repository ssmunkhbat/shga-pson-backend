import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardDetentionHergiinHolbogdogchDto {

    @Expose({ name: 'DETENTION_ID' })
    detentionId: number;

    @Expose({ name: 'CASE_NUMBER' })
    caseNumber: string;

    @Expose({ name: 'STATE_REG_NUMBER' })
    stateRegNumber: string;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    @Expose({ name: 'CELL_NUMBER' })
    cellNumber: string;
}