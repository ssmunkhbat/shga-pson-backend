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

    @Expose({ name: 'DEPARTMENT_REGIME_ID' })
    departmentRegimeId: number;

    @Expose({ name: 'DEPARTMENT_REGIME_CLASS_ID' })
    departmentRegimeClassId: number;

    @Expose({ name: 'REGIME_NAME' })
    regimeName: string;

    @Expose({ name: 'CLASS_NAME' })
    className: string;
}