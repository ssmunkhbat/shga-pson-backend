import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BaseRoleDtoValidator {
  @IsNumber({}, { message: 'personId утга байх ёстой.' })
  @IsNotEmpty({ message: 'personId утга шаардана.' })
  personId: string;

  @IsString({ message: 'Регистр утга шаардана.' })
  @IsNotEmpty({ message: 'Регистр утга шаардана.' })
  stateRegNumber: string;

  @IsString({ message: 'Ургийн овог утга шаардана.' })
  @IsNotEmpty({ message: 'Ургийн овог утга шаардана.' })
  familyName: string;

  @IsString({ message: 'Эцэг/Эхийн нэр утга шаардана.' })
  @IsNotEmpty({ message: 'Эцэг/Эхийн нэр утга шаардана.' })
  lastName: string;

  @IsString({ message: 'Өөрийн нэр утга шаардана.' })
  @IsNotEmpty({ message: 'Өөрийн нэр утга шаардана.' })
  firstName: string;

  // @IsDateString()
  // @IsNotEmpty({ message: 'Төрсөн огноо утга шаардана.' })
  // dateOfBirth: string;

  @IsNumber({}, { message: 'Хүйс утга байх ёстой.' })
  @IsNotEmpty({ message: 'Хүйс утга шаардана.' })
  genderId: number;

  @IsNumber({}, { message: 'Иргэний харъяалал утга байх ёстой.' })
  @IsNotEmpty({ message: 'Иргэний харъяалал утга шаардана.' })
  countryId: number;

  @IsNumber({}, { message: 'Яс үндэс утга байх ёстой.' })
  @IsNotEmpty({ message: 'Яс үндэс утга шаардана.' })
  nationalityId: number;

  @IsNumber({}, { message: 'Боловсрол утга байх ёстой.' })
  @IsNotEmpty({ message: 'Боловсрол утга шаардана.' })
  educationId: number;
}
