import { Expose, Type } from '@nestjs/class-transformer';

export class MenuMetaDto {
    @Expose({ name: 'META_TYPE_ID' })
    metaTypeId: number;

    @Expose({ name: 'PERMISSION_ID' })
    permissionId: number;

    @Expose({ name: 'TRG_META_DATA_ID' })
    trgMetaDataId: number;

    @Expose({ name: 'TRG_META_DATA_NAME' })
    trgMetaDataName: string;

    @Expose({ name: 'ICON' })
    icon: string;

    @Expose({ name: 'ORDER_NUM' })
    orderNum: number;

    @Expose({ name: 'CHILDREN' })
    children: MenuMetaDto[];
}