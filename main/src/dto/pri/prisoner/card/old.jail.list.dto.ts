import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardOldJailListDto {

    @Expose({ name: 'CODE' })
    code: string;

    @Expose({ name: 'DECISION_YEAR' })
    decisionYear: number;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;

    @Expose({ name: 'RELEASED_YEAR' })
    releasedYear: number;

    @Expose({ name: 'RELEASE_NAME' })
    releaseName: string;

    @Expose({ name: 'SENTENCE_YEARS' })
    sentenceYears: number;
}