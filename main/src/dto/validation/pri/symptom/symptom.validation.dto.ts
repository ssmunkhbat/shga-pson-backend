import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PriPersonSymptomValidationDto {
  @IsOptional()
  @IsNumber({}, { message: 'personSymptomId байх ёстой' })
  personSymptomId: number;

  @IsNumber({}, { message: 'symptomId байх ёстой' })
  @IsNotEmpty()
  symptomId: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'organId байх ёстой' })
  organId: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'organDetailId байх ёстой' })
  organDetailId: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'personId байх ёстой' })
  personId: number;
  
  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  filePath: string;
}