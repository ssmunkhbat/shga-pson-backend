import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardMovementDepartureDto {

    @Expose({ name: 'ARRIVAL_DATE' })
    arrivalDate: Date;

    @Expose({ name: 'DEPARTURE_DATE' })
    departureDate: Date;

    @Expose({ name: 'DESCRIPTION' })
    description: string;

    @Expose({ name: 'FROM_DEPARTMENT_NAME' })
    fromDepartmentName: string;

    @Expose({ name: 'TO_DEPARTMENT_NAME' })
    toDepartmentName: string;
}