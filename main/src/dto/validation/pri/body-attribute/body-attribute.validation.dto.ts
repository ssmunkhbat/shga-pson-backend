import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class PriPrisonerBodyAttributeValidationDto {
  
  @IsOptional()
  @IsNumber({}, { message: 'prisonerBodyAttributeId байх ёстой' })
  prisonerBodyAttributeId: number;

  @IsNumber({}, { message: 'prisonerId байх ёстой' })
  @IsNotEmpty()
  prisonerId: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'bodyAttributeId байх ёстой' })
  bodyAttributeId: number;

  @IsNotEmpty()
  @IsNumber({}, { message: 'bodyAttributeTypeId байх ёстой' })
  bodyAttributeTypeId: number;
  
  @IsOptional()
  @IsString()
  description: string;

}