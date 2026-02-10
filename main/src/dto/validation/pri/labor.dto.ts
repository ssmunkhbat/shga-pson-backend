import { IsNumber, IsNotEmpty, IsOptional, IsDateString, IsString, IsArray } from 'class-validator';

export class PriLaborValidationDto {

  @IsOptional()
  @IsNumber({}, { message: 'laborId тоо байх ёстой.' })
  laborId: number;

  @IsNumber({}, { message: 'Хөдөлмөрийн төрөл утга байх ёстой.' })
  @IsNotEmpty({ message: 'Хөдөлмөрийн төрөл утга шаардана.' })
  laborTypeId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Алба хэлтэс утга байх ёстой.' })
  departmentId: number;

  @IsNotEmpty({ message: 'Эхлэх огноо утга шаардана.' })
  beginDate: Date;

  @IsOptional()
  endDate: Date;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray({ message: 'Хоригдогчдын жагсаалт массив байх ёстой.' })
  prisoners: any[];
}
