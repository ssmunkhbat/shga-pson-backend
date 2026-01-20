import { Expose } from '@nestjs/class-transformer';

export class MenuSettingsDto {

    @Expose({ name: 'ID' })
    id: number;

    @Expose({ name: 'META_DATA_ID' })
    metaDataId: number;

    @Expose({ name: 'PARENT_ID' })
    parentId: number;

    @Expose({ name: 'CODE' })
    code: string;

    // @Expose({ name: 'NAME' })
    // name: string;

    @Expose({ name: 'TYPE' })
    type: string;

    @Expose({ name: 'NAME' })
    label: string;

    @Expose({ name: 'ICON' })
    icon: string;

    @Expose({ name: 'ORDER_NUM' })
    orderNum: number;

    @Expose({ name: 'PATH' })
    path: string;

    @Expose({ name: 'CHILDREN' })
    children: MenuSettingsDto[];

    @Expose({ name: 'ACTIONS' })
    actions: any[];
}