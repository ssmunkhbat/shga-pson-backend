import { IsNotEmpty, IsString } from "class-validator";

export class ChangePasswordValidationDto {
  @IsString({ message: 'Одоогийн нууц үг утга шаардана' })
  @IsNotEmpty({ message: 'Одоогийн нууц үг утга шаардана' })
  currentPassword: string;

  @IsString({ message: 'Шинэ нууц үг утга шаардана' })
  @IsNotEmpty({ message: 'Шинэ нууц үг утга шаардана' })
  newPassword: string;

  @IsString({ message: 'Нууц үг давтах утга шаардана' })
  @IsNotEmpty({ message: 'Нууц үг давтах утга шаардана' })
  confirmPassword: string;
}