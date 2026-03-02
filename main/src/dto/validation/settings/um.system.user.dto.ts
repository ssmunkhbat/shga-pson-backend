import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class UmSystemUserValidationDto {

  @IsOptional()
  @IsNumber({}, { message: 'userId байх ёстой.' })
  userId: number;

  @IsNumber({}, { message: 'Иргэн утга байх ёстой.' })
  @IsNotEmpty({ message: 'Иргэн утга шаардана.' })
  personId: number;

  @IsNumber({}, { message: 'Алба хэлтэс утга байх ёстой.' })
  @IsNotEmpty({ message: 'Алба хэлтэс утга шаардана.' })
  departmentId: number;

  @IsNumber({}, { message: 'Албан тушаалын төрөл утга байх ёстой.' })
  @IsNotEmpty({ message: 'Албан тушаалын төрөл утга шаардана.' })
  positionTypeId: number;

  @IsOptional()
  militaryRankId: number;

  @IsString({ message: 'Регистрийн дугаар утга шаардана.' })
  @IsNotEmpty({ message: 'Регистрийн дугаар утга шаардана.' })
  stateRegNumber: string;

  @IsString({ message: 'Албан хаагчийн код утга шаардана.' })
  @IsNotEmpty({ message: 'Албан хаагчийн код утга шаардана.' })
  employeeCode: string;

  @IsString({ message: 'Хэрэглэгчийн нэр утга шаардана.' })
  @IsNotEmpty({ message: 'Хэрэглэгчийн нэр утга шаардана.' })
  userName: string;

  @IsOptional()
  password: string;

}
