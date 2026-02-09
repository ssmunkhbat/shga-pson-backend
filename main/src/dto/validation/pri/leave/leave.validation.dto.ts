import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
export class PriLeaveValidationDto {
  @IsNumber({}, { message: 'leaveId байх ёстой' })
  @IsNotEmpty({ message: 'leaveId утга шаардана' })
  leaveId: number;

  @IsNumber({}, { message: 'prisonerKeyId байх ёстой' })
  @IsNotEmpty({ message: 'prisonerKeyId утга шаардана' })
  prisonerKeyId: number;
 
  @IsNumber({}, { message: 'leaveTypeId байх ёстой' })
  @IsNotEmpty({ message: 'leaveTypeId утга шаардана' })
  leaveTypeId: number;

  @IsNumber({}, { message: 'decisionId байх ёстой' })
  @IsNotEmpty({ message: 'decisionId утга шаардана' })
  decisionId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'leaveDate огноо утга шаардана.' })
  leaveDate: Date;

  @IsNumber({}, { message: 'officerId байх ёстой' })
  @IsNotEmpty({ message: 'officerId утга шаардана' })
  officerId: number;

  @IsNumber({}, { message: 'officerId байх ёстой' })
  @IsNotEmpty({ message: 'officerId утга шаардана' })
  wfmStatusId: number;
  
  @IsOptional()
  @IsString({ message: 'Тайлбар текст байна.' })
  description: string;
}