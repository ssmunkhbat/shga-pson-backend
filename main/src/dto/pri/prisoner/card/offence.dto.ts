import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardOffenceDto {

    @Expose({ name: 'OFFENCE_DATE' })
    offenceDate: string;

    @Expose({ name: 'OFFENCE_ACTION_TYPE_NAME' })
    offenceActionTypeName: string;
}