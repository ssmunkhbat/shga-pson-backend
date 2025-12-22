import { Expose, Type } from '@nestjs/class-transformer';

export class RefDto {
    @Expose({ name: 'ID' })
    id: number;

    @Expose({ name: 'NAME' })
    name: string;

    @Expose({ name: 'USER_NAME' })
    userName: string;

    @Expose({ name: 'CODE' })
    code: string;

    @Expose({ name: 'IS_ACTIVE' })
    @Type(() => Boolean)
    isActive: boolean;

    @Expose({ name: 'SORT_DEFAULT' })
    sortDefault: number;
}