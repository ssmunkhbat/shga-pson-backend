import { Expose, Transform, Type } from '@nestjs/class-transformer';

export class RefDto {
    @Expose()
    // @Transform(({ obj }) =>
    //     obj.SOUM_ID ??
    //     obj.AIMAG_ID ??
    //     obj.ROLE_ID ??
    //     obj.MOVEMENT_TYPE_PRISONER_ID ??
    //     obj.DEPARTMENT_ID ??
    //     obj.DEPARTMENT_REGIME_ID ??
    //     obj.COUNTRY_ID ??
    //     obj.NATIONALITY_ID ??
    //     obj.EDUCATION_ID
    // )
    @Transform(({ obj }) =>
        [
            'BAG_ID',
            'SOUM_ID',
            'AIMAG_ID',
            'ROLE_ID',
            'MOVEMENT_TYPE_PRISONER_ID',
            'DEPARTMENT_ID',
            'DEPARTMENT_REGIME_ID',
            'COUNTRY_ID',
            'NATIONALITY_ID',
            'EDUCATION_ID',
            'ADDRESS_TYPE_ID',
            'BOOK_TYPE_ID',
            'TRANSACTION_TYPE_ID',
        ].map(k => obj[k]).find(v => v !== undefined && v !== null)
    )
    id: number;

    @Expose({ name: 'NAME' })
    @Transform(({ obj }) =>
        [
            'NAME',
            'COUNTRY_NAME',
        ].map(k => obj[k]).find(v => v !== undefined && v !== null)
    )
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