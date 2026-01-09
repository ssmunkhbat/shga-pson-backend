import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MovementDepartureDetailDto {
  @IsNumber()
  prisonerKeyId: number;

  @IsNumber()
  @IsOptional()
  reasonId: number;

  @IsNumber()
  @IsOptional()
  regimenId: number;

  @IsNumber()
  @IsOptional()
  classId: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsOptional()
  isSpecialAttention: number;
}

export class CreateMovementDepartureDto {
  @IsString()
  departureDate: string; // YYYY-MM-DD

  @IsNumber()
  fromDepartmentId: number;

  @IsNumber()
  toDepartmentId: number;

  @IsNumber()
  movementTypeId: number;

  @IsNumber()
  @IsOptional()
  decisionId: number;

  @IsNumber()
  @IsOptional()
  officerId: number;

  @IsOptional()
  officerName: string;

  @IsNumber()
  @IsOptional()
  employeeId: number;

  @IsString()
  @IsOptional()
  grantPassword: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MovementDepartureDetailDto)
  prisoners: MovementDepartureDetailDto[];
}
