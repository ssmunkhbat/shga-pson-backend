import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
export class PriLeaveValidationDto {
  @IsOptional()
  @IsNumber({}, { message: 'leaveId байх ёстой' })
  leaveId: number;

  @IsNumber({}, { message: 'prisonerKeyId тоо байх ёстой' })
  @IsNotEmpty({ message: 'prisonerKeyId утга шаардана' })
  prisonerKeyId: number;
 
  @IsNumber({}, { message: 'leaveTypeId тоо байх ёстой' })
  @IsNotEmpty({ message: 'leaveTypeId утга шаардана' })
  leaveTypeId: number;

  @IsNumber({}, { message: 'decisionId тоо байх ёстой' })
  @IsNotEmpty({ message: 'decisionId утга шаардана' })
  decisionId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'leaveDate огноо утга шаардана.' })
  leaveDate: Date;

  @IsNumber({}, { message: 'officerId тоо байх ёстой' })
  @IsNotEmpty({ message: 'officerId утга шаардана' })
  officerId: number;

  @IsNumber({}, { message: 'wfmStatusId тоо байх ёстой' })
  @IsNotEmpty({ message: 'wfmStatusId утга шаардана' })
  wfmStatusId: number;
  
  @IsOptional()
  @IsString({ message: 'Тайлбар текст байна.' })
  description: string;
}