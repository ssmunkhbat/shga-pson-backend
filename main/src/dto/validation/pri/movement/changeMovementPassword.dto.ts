import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChangeMovementPasswordDto {
  @IsNumber({}, { message: 'movementDeparturePackId утга байх ёстой.' })
  @IsNotEmpty({ message: 'movementDeparturePackId утга шаардана.' })
  movementDeparturePackId: number;

  @IsString({ message: 'newPassword утга байх ёстой.' })
  @IsNotEmpty({ message: 'newPassword утга шаардана.' })
  newPassword: string;
}
