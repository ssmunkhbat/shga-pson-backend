import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PriDecisionValidationDto {

  @IsNumber({}, { message: 'personId утга байх ёстой.' })
  @IsNotEmpty({ message: 'personId утга шаардана.' })
  personId: number;

  @IsOptional()
  @IsNumber({}, { message: 'decisionId байх ёстой.' })
  decisionId: number;
}
