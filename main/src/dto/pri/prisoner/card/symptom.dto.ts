import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardSymptomDto {

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'DTL_NAME' })
    dtlName: string;

    @Expose({ name: 'NAME' })
    name: string;

    @Expose({ name: 'SYMPTOM_NAME' })
    symptomName: string;
}