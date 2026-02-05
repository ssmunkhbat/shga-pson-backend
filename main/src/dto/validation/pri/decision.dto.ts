import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class PriDecisionValidationDto {

  @IsOptional()
  @IsNumber({}, { message: 'decisionId байх ёстой.' })
  decisionId: number;

  @IsString({ message: 'Шийдвэрийн дугаар утга шаардана.' })
  @IsNotEmpty({ message: 'Шийдвэрийн дугаар утга шаардана.' })
  decisionNumber: string;

  @IsNumber({}, { message: 'Алба хэлтэс утга байх ёстой.' })
  @IsNotEmpty({ message: 'Алба хэлтэс утга шаардана.' })
  departmentId: number;
  
  @IsDateString()
  @IsNotEmpty({ message: 'Шийдвэрийн огноо утга шаардана.' })
  decisionDate: Date;

  @IsNumber({}, { message: 'Шийдвэрийн төрөл утга байх ёстой.' })
  @IsNotEmpty({ message: 'Шийдвэрийн төрөл утга шаардана.' })
  decisionTypeId: number;
  
  @IsOptional()
  employeeId: number;

  @IsOptional()
  employeeName: string;
  
  @IsOptional()
  createdDate: Date;
  
  @IsOptional()
  createdEmployeeKeyId: number;
  
  @IsOptional()
  documentRegisterationId: number;

}
