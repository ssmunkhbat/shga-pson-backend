import { Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsDateString, IsOptional, IsString, IsArray, ArrayNotEmpty } from 'class-validator';
export class PriTrainingValidationDto {
  @IsOptional()
  @IsNumber({}, { message: 'trainingId тоо байх ёстой' })
  trainingId: number;

  @IsNotEmpty({ message: 'infoTrainingId утга шаардана.' })
  @IsNumber({}, { message: 'infoTrainingId тоо байх ёстой' })
  infoTrainingId: number;

  @IsDateString({}, { message: 'beginDate огноо байх ёстой' })
  @IsNotEmpty({ message: 'beginDate огноо утга шаардана.' })
  beginDate: Date;

  @IsOptional()
  @IsDateString({}, { message: 'endDate огноо байх ёстой' })
  endDate: Date;

  @IsNotEmpty({ message: 'wfmStatusId утга шаардана.' })
  @IsNumber({}, { message: 'wfmStatusId тоо байх ёстой' })
  wfmStatusId: number;

  @IsOptional()
  @IsNumber({}, { message: 'timesAWeek тоо байх ёстой' })
  timesAWeek: number;
  
  @IsOptional()
  @IsDateString({}, { message: 'timeOfDay огноо байх ёстой' })
  timeOfDay: Date;

  @IsOptional()
  @IsString({ message: 'description тэмдэгт байх ёстой' })
  description: string;

  @IsOptional()
  @IsDateString({}, { message: 'finishTimeOfDay огноо байх ёстой' })
  finishTimeOfDay: Date;

  @IsOptional()
  @IsString({ message: 'teacherName тэмдэгт байх ёстой' })
  teacherName: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  prisonerKeys: number[];
}
