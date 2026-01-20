import { Expose } from '@nestjs/class-transformer';

export class ActionSettingsDto {

    @Expose({ name: 'ID' })
    id: number;

    @Expose({ name: 'META_DATA_ID' })
    metaDataId: number;

    @Expose({ name: 'MENU_ID' })
    menuId: number;

    @Expose({ name: 'CODE' })
    code: string;

    @Expose({ name: 'NAME' })
    name: string;

    @Expose({ name: 'ICON' })
    icon: string;

    @Expose({ name: 'ORDER_NUM' })
    orderNum: number;
}