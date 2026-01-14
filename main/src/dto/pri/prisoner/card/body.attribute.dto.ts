import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardBodyAttributeDto {

    @Expose({ name: 'TYPE_NAME' })
    typeName: string;

    @Expose({ name: 'NAME' })
    name: string;
}