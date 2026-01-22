import { Expose } from '@nestjs/class-transformer';

export class BasePersonDto {

    @Expose({ name: 'PERSON_ID' })
    personId: number;

    @Expose({ name: 'STATE_REG_NUMBER' })
    stateRegNumber: string;

    @Expose({ name: 'FAMILY_NAME' })
    familyName: string;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    @Expose({ name: 'LAST_NAME' })
    lastName: string;

    @Expose({ name: 'DATE_OF_BIRTH' })
    dateOfBirth: Date;

    @Expose({ name: 'GENDER_ID' })
    genderId: number;

    @Expose({ name: 'COUNTRY_ID' })
    countryId: number;

    @Expose({ name: 'NATIONALITY_ID' })
    nationalityId: number;

    @Expose({ name: 'EDUCATION_ID' })
    educationId: number;
}