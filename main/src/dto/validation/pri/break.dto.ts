
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PriPrisonerBreakValidationDto {
  
  @IsOptional()
  @IsNumber({}, { message: 'prisonerBreakId утга тоо байх ёстой.' })
  prisonerBreakId: number;

  @IsNotEmpty({ message: 'Хоригдогч сонгоно уу.' })
  @IsNumber({}, { message: 'prisonerKeyId утга тоо байх ёстой.' })
  prisonerKeyId: number;

  @IsNotEmpty({ message: 'Оргосон огноо оруулна уу.' })
  breakDate: Date;

  @IsOptional()
  @IsString({ message: 'Тайлбар утга тэмдэгт мөр байх ёстой.' })
  description: string;

  @IsOptional()
  @IsNumber({}, { message: 'wfmStatusId утга тоо байх ёстой.' })
  wfmStatusId: number;

  @IsOptional()
  foundDate: Date;

  @IsOptional()
  @IsNumber({}, { message: 'isFound утга тоо байх ёстой.' })
  isFound: number;

  @IsOptional()
  @IsNumber({}, { message: 'isTracking утга тоо байх ёстой.' })
  isTracking: number;

  @IsOptional()
  @IsNumber({}, { message: 'hasReward утга тоо байх ёстой.' })
  hasReward: number;

  @IsOptional()
  @IsNumber({}, { message: 'rewardAmount утга тоо байх ёстой.' })
  rewardAmount: number;

  @IsOptional()
  @IsString({ message: 'contactInfo утга тэмдэгт мөр байх ёстой.' })
  contactInfo: string;
}
