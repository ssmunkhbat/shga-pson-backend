import { Expose } from '@nestjs/class-transformer';

export class MenuDto {

    @Expose({ name: 'ID' })
    id: number;

    @Expose({ name: 'META_DATA_ID' })
    metaDataId: number;

    @Expose({ name: 'PARENT_ID' })
    parentId: number;

    @Expose({ name: 'CODE' })
    code: string;

    @Expose({ name: 'TYPE' })
    type: string;

    @Expose({ name: 'ICON' })
    icon: string;

    @Expose({ name: 'ORDER_NUM' })
    orderNum: number;

    @Expose({ name: 'PATH' })
    path: string;

    @Expose({ name: 'CHILDREN' })
    children: MenuDto[];
}