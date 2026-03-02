import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PriOffenceActionValidationDto {
  
  @IsOptional()
  @IsNumber()
  offenceActionId: number;

  @IsNotEmpty()
  @IsNumber()
  offenceId: number;

  @IsNumber()
  @IsNotEmpty()
  administrativeDecisionId: number;

  @IsNotEmpty()
  @IsNumber()
  offenceActionTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  wfmStatusId: number;

  @IsOptional()
  description: string;
  
  @IsOptional()
  @IsNumber()
  laborTypeId: number;

  @IsOptional()
  @IsDateString()
  beginDate: Date;

  @IsOptional()
  @IsDateString()
  endDate: Date;

  @IsOptional()
  @IsDateString()
  dateOfBonus: Date;

  @IsOptional()
  @IsNumber()
  days: number;

}

// offenceId: Number(data.offenceId),
// offenceActionId: data.offenceActionId ? Number(data.offenceActionId) : null,
// administrativeDecisionId: personalInfo.administrativeDecisionId,
// offenceActionTypeId: Number(data.offenceTypeId),
// wfmStatusId: Number(data.wfmStatusId),
// isCriminalCase: data.isCriminalCase,
// description: data.description,
// laborTypeId: data.laborTypeId ? Number(data.laborTypeId) : null,
// beginDate: data.beginDate,
// endDate: data.endDate,
// dateOfBonus: data.dateOfBonus,
// days: data.days