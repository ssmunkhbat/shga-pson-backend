import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PriOffenceValidationDto {
  
  @IsOptional()
  @IsNumber()
  offenceId: number;

  @IsNumber()
  @IsNotEmpty()
  offenceTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  prisonerKeyId: number;

  @IsNotEmpty()
  @IsDateString()
  offenceDate: Date;

  @IsOptional()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isCriminalCase: boolean;

}