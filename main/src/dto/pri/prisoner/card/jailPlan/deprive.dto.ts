import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanDepriveDto {

    @Expose({ name: 'NAME' })
    name: string;

    @Expose({ name: 'DESCRIPTION' })
    description: string;
}