import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Текст утга шаардана.' })
  @IsNotEmpty({ message: 'Текст утга шаардана.' })
  roleCode: string;

  @IsString({ message: 'Текст утга шаардана.' })
  @IsNotEmpty({ message: 'Текст утга шаардана.' })
  roleName: string;
}
