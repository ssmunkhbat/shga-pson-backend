import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardAddressDto {

    @Expose({ name: 'TYPE_NAME' })
    typeName: string;

    @Expose({ name: 'ADDRESS' })
    address: string;
}