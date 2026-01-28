import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardPersonalDetentionDto {
    @Expose({ name: 'ACTION_DATE' })
    actionDate: Date;

    @Expose({ name: 'ADMINISTRATION_PLACE' })
    administrationPlace: number;

    @Expose({ name: 'AGE' })
    age: number;

    // Төрсөн Газар
    @Expose({ name: 'BIRTH_PLACE' })
    birthPlace: string;

    // Иргэний харъяалал
    @Expose({ name: 'COUNTRY_NAME' })
    countryName: string;

    @Expose({ name: 'DATE_OF_BIRTH' })
    dateOfBirth: Date;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;

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

    @Expose({ name: 'IMAGE1' })
    image1: string;

    @Expose({ name: 'IMAGE2' })
    image2: string;

    @Expose({ name: 'IMAGE3' })
    image3: string;

    @Expose({ name: 'LAST_NAME' })
    lastName: string;

    @Expose({ name: 'MARITAL_STATUS' })
    martialStatus: string;

    // Яс үндэс
    @Expose({ name: 'ORIGIN_NAME' })
    originName: string;

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

    @Expose({ name: 'LAW_ACT_CODE' })
    lawActCode: string;

    @Expose({ name: 'CLOTHES_DETAIL' })
    clothesDetail: string;

    @Expose({ name: 'DETENTION_ID' })
    detentionId: number;

    @Expose({ name: 'CASE_NUMBER' })
    caseNumber: string;

    @Expose({ name: 'DO_DEPARTMENT_NAME' })
    doDepartmentName: string;

    @Expose({ name: 'DO_POSITION' })
    doPosition: string;

    @Expose({ name: 'DO_FIRST_NAME' })
    doFirstName: string;

    @Expose({ name: 'DO_PHONE' })
    doPhone: string;
}