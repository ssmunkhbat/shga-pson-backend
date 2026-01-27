import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class MovementDepartureDetailDto {
  @IsNumber({}, { message: 'prisonerKeyId утга байх ёстой.' })
  @IsNotEmpty({ message: 'prisonerKeyId утга шаардана.' })
  prisonerKeyId: number;

  @IsNumber({}, { message: 'reasonId утга байх ёстой.' })
  @IsOptional()
  reasonId: number;

  @IsNumber({}, { message: 'regimenId утга байх ёстой.' })
  @IsOptional()
  regimenId: number;

  @IsNumber({}, { message: 'classId утга байх ёстой.' })
  @IsOptional()
  classId: number;

  @IsString({ message: 'description утга байх ёстой.' })
  @IsOptional()
  description: string;

  @IsNumber({}, { message: 'isSpecialAttention утга байх ёстой.' })
  @IsOptional()
  isSpecialAttention: number;
}

export class CreateMovementDepartureDto {
  @IsDateString({}, { message: 'departureDate огноо байх ёстой.' })
  @IsNotEmpty({ message: 'departureDate утга шаардана.' })
  departureDate: string; // YYYY-MM-DD

  @IsNumber({}, { message: 'fromDepartmentId утга байх ёстой.' })
  @IsNotEmpty({ message: 'fromDepartmentId утга шаардана.' })
  fromDepartmentId: number;

  @IsNumber({}, { message: 'toDepartmentId утга байх ёстой.' })
  @IsNotEmpty({ message: 'toDepartmentId утга шаардана.' })
  toDepartmentId: number;

  @IsNumber({}, { message: 'movementTypeId утга байх ёстой.' })
  @IsNotEmpty({ message: 'movementTypeId утга шаардана.' })
  movementTypeId: number;

  @IsNumber({}, { message: 'decisionId утга байх ёстой.' })
  @IsOptional()
  decisionId: number;

  @IsNumber({}, { message: 'officerId утга байх ёстой.' })
  @IsOptional()
  officerId: number;

  @IsString({ message: 'officerName утга байх ёстой.' })
  @IsOptional()
  officerName: string;

  @IsNumber({}, { message: 'employeeId утга байх ёстой.' })
  @IsOptional()
  employeeId: number;

  @IsString({ message: 'grantPassword утга байх ёстой.' })
  @IsOptional()
  grantPassword: string;

  @IsArray({ message: 'prisoners жагсаалт байх ёстой.' })
  @ValidateNested({ each: true })
  @Type(() => MovementDepartureDetailDto)
  prisoners: MovementDepartureDetailDto[];
}
