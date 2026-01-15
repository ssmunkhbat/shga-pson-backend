import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardReleaseDto {

    @Expose({ name: 'DECISION_NUMBER' })
    decisionNumber: string;

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'NAME' })
    name: string;

    @Expose({ name: 'RELEASE_DATE' })
    releaseDate: Date;
}