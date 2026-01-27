import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMovementArrivalDto {
  @IsArray({ message: 'movementDepartureIds жагсаалт байх ёстой.' })
  @IsNotEmpty({ message: 'movementDepartureIds утга шаардана.' })
  movementDepartureIds: number[];

  @IsDateString({}, { message: 'arrivalDate огноо байх ёстой.' })
  @IsNotEmpty({ message: 'arrivalDate утга шаардана.' })
  arrivalDate: string;

  @IsString({ message: 'description утга байх ёстой.' })
  @IsOptional()
  description: string;
}
