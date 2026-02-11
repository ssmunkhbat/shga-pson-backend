import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
export class PriRotlValidationDto {
  @IsOptional()
  @IsNumber({}, { message: 'rotlId байх ёстой' })
  rotlId: number;

  @IsNumber({}, { message: 'prisonerKeyId тоо байх ёстой' })
  @IsNotEmpty({ message: 'prisonerKeyId утга шаардана' })
  prisonerKeyId: number;
 
  @IsNumber({}, { message: 'rotlTypeId тоо байх ёстой' })
  @IsNotEmpty({ message: 'rotlTypeId утга шаардана' })
  rotlTypeId: number;

  @IsNumber({}, { message: 'administrativeDecisionId тоо байх ёстой' })
  @IsNotEmpty({ message: 'administrativeDecisionId утга шаардана' })
  administrativeDecisionId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'leaveDate огноо утга шаардана.' })
  leaveDate: Date;
  
  @IsDateString()
  @IsNotEmpty({ message: 'arriveDate огноо утга шаардана.' })
  arriveDate: Date;

  // @IsOptional()
  // @IsNumber({}, { message: 'officerId тоо байх ёстой' })
  // officerId: number;

  @IsNumber({}, { message: 'wfmStatusId тоо байх ёстой' })
  @IsNotEmpty({ message: 'wfmStatusId утга шаардана' })
  wfmStatusId: number;
  
  @IsOptional()
  @IsString({ message: 'Тайлбар текст байна.' })
  description: string;
}