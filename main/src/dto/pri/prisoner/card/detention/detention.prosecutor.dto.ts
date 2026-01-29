import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardDetentionProsecutorDto {

    @Expose({ name: 'CASE_OFFICE_TYPE_ID' })
    familyMemberCount: number;

    @Expose({ name: 'OFFICER_TYPE_NAME' })
    officerTypeName: string;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    @Expose({ name: 'PHONE' })
    phone: string;

    @Expose({ name: 'POSITION' })
    position: string;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;
}