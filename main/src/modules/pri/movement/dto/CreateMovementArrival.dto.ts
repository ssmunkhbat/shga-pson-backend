import { IsNotEmpty, IsNumber, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovementArrivalDto {
  @IsNotEmpty()
  @IsArray()
  movementDepartureIds: number[];

  @IsNotEmpty()
  arrivalDate: string;

  @IsOptional()
  @IsString()
  description: string;
}
