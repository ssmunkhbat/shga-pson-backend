import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardDetentionInterrogationDto {

    @Expose({ name: 'ID' })
    id: number;

    @Expose({ name: 'PRISONER_KEY_ID' })
    prisonerKeyId: number;
    
    @Expose({ name: 'BOOK_DATE' })
    bookDate: Date;
    
    @Expose({ name: 'START_TIME' })
    startTime: Date;
    
    @Expose({ name: 'END_TIME' })
    endTime: Date;

    @Expose({ name: 'OFFICER_ID' })
    officerId: number;
    
    @Expose({ name: 'CREATED_DATE' })
    createdDate: Date;

    @Expose({ name: 'CREATED_EMPLOYEE_KEY_ID' })
    createdEmployeeKeyId: number;

    @Expose({ name: 'LAST_NAME' })
    lastName: string;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;
}