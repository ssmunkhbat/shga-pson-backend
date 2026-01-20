import { IsNumber, IsArray, IsObject } from 'class-validator';

export class SaveMenuSettingsDto {
  @IsNumber()
  roleId: number;

  @IsArray()
  @IsNumber({}, { each: true })
  menuIds: number[];

  @IsObject()
  actions: { [key: number]: number[] };
}
