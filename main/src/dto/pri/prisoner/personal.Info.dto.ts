import { Expose } from '@nestjs/class-transformer';

export class PrisonerPersonalInfoDto {

    // Иргэний харъяалал
    @Expose({ name: 'COUNTRY_NAME' })
    countryName: string;

    @Expose({ name: 'DATE_OF_BIRTH' })
    dateOfBirth: Date;

    @Expose({ name: 'EDUCATION_ID' })
    educationId: number;

    // Боловсрол
    @Expose({ name: 'EDUCATION_NAME' })
    educationName: string;

    @Expose({ name: 'FAMILY_MEMBER_COUNT' })
    familyMemberCount: number;

    @Expose({ name: 'FAMILY_NAME' })
    familyName: string;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    // Хүйс
    @Expose({ name: 'GENDER_NAME' })
    genderName: string;

    @Expose({ name: 'LAST_NAME' })
    lastName: string;

    @Expose({ name: 'MARITAL_STATUS_ID' })
    maritalStatusId: number;

    @Expose({ name: 'NATIONALITY_NAME' })
    nationalityName: string;

    @Expose({ name: 'NICKNAME' })
    nickname: string;

    @Expose({ name: 'PICTURE_PATH' })
    picturePath: string;

    @Expose({ name: 'ATTACH' })
    attach: string;

    @Expose({ name: 'PERSON_ID' })
    personId: number;

    @Expose({ name: 'COUNTRY_ID' })
    countryId: number;

    @Expose({ name: 'NATIONALITY_ID' })
    nationalityId: number;

    // Өмнө эрхэлж байсан ажил
    @Expose({ name: 'POSITION' })
    position: string;

    @Expose({ name: 'PRISONER_NUMBER' })
    prisonerNumber: number;

    // Мэргэжил
    @Expose({ name: 'PROFESSION' })
    profession: string;

    @Expose({ name: 'STATE_REG_NUMBER' })
    stateRegNumber: string;
    

    @Expose({ name: 'ADMINISTRATION_AIMAG_ID' })
    administrationAimagId: number;

    @Expose({ name: 'ADMINISTRATION_SOUM_ID' })
    administrationSoumId: number;

    // Мэргэжил
    @Expose({ name: 'ADMINISTRATION_ADDRESS' })
    administrationAddress: string;

    @Expose({ name: 'BIRTH_AIMAG_ID' })
    birthAimagId: number;

    @Expose({ name: 'BIRTH_SOUM_ID' })
    birthSoumId: number;
    @Expose({ name: 'RELIGION_ID' })
    religionId: number;
}