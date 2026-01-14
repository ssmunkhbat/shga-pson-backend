import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardFamilyDto {

    @Expose({ name: 'NAME' })
    name: string;

    @Expose({ name: 'PERSON_NAME' })
    personName: string;

    @Expose({ name: 'PHONE' })
    phone: string;

    @Expose({ name: 'POSITION' })
    position: string;

    @Expose({ name: 'STATE_REG_NUMBER' })
    stateRegNumber: string;
}