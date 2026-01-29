import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardDetentionOfficerMeetingsDto {
    
    @Expose({ name: 'MEETING_DATE' })
    meetingDate: Date;

    @Expose({ name: 'DETENTION_ID' })
    detentionId: number;

    @Expose({ name: 'PRISONER_ID' })
    prisonerId: number;

    @Expose({ name: 'LAST_NAME' })
    lastName: string;

    @Expose({ name: 'FIRST_NAME' })
    firstName: string;

    @Expose({ name: 'ID_NUMBER' })
    idNumber: string;

    @Expose({ name: 'MEETING_TYPE_NAME' })
    meetingTypeName: string;
    
    @Expose({ name: 'START_TIME' })
    startTime: Date;
    
    @Expose({ name: 'END_TIME' })
    endTime: Date;
}