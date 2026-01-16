import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrisonerCardPersonalInfoDto {

  @IsNumber({}, { message: 'personId утга байх ёстой.' })
  @IsNotEmpty({ message: 'personId утга шаардана.' })
  personId: number;

  @IsString({ message: 'Хоригдогчийн дугаар утга шаардана.' })
  @IsNotEmpty({ message: 'Хоригдогчийн дугаар утга шаардана.' })
  prisonerNumber: number;

  @IsString({ message: 'Регистр утга шаардана.' })
  @IsNotEmpty({ message: 'Регистр утга шаардана.' })
  stateRegNumber: string;

  @IsString({ message: 'Эцэг/Эхийн нэр утга шаардана.' })
  @IsNotEmpty({ message: 'Эцэг/Эхийн нэр утга шаардана.' })
  lastName: string;

  @IsString({ message: 'Өөрийн нэр утга шаардана.' })
  @IsNotEmpty({ message: 'Өөрийн нэр утга шаардана.' })
  firstName: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Төрсөн огноо утга шаардана.' })
  dateOfBirth: Date;

  @IsNumber({}, { message: 'Яс үндэс утга байх ёстой.' })
  @IsNotEmpty({ message: 'Яс үндэс утга шаардана.' })
  nationalityId: number;

  @IsNumber({}, { message: 'Төрсөн аймаг / хот утга байх ёстой.' })
  @IsNotEmpty({ message: 'Төрсөн аймаг / хот утга шаардана.' })
  birthAimagId: number;

  @IsNumber({}, { message: 'Төрсөн сум / дүүрэг утга байх ёстой.' })
  @IsNotEmpty({ message: 'Төрсөн сум / дүүрэг утга шаардана.' })
  birthSoumId: number;

  @IsNumber({}, { message: 'Захиргааны нэгж Аймаг / хот утга байх ёстой.' })
  @IsNotEmpty({ message: 'Захиргааны нэгж Аймаг / хот утга шаардана.' })
  administrationAimagId: number;

  @IsNumber({}, { message: 'Захиргааны нэгж Сум / дүүрэг утга байх ёстой.' })
  @IsNotEmpty({ message: 'Захиргааны нэгж Сум / дүүрэг утга шаардана.' })
  administrationSoumId: number;

  @IsString({ message: 'Захиргааны нэгж баг / хороо утга шаардана.' })
  @IsNotEmpty({ message: 'Захиргааны нэгж баг / хороо утга шаардана.' })
  administrationAddress: string;

  @IsNumber({}, { message: 'Гэр бүлийн тоо утга байх ёстой.' })
  @IsNotEmpty({ message: 'Гэр бүлийн тоо утга шаардана.' })
  familyMemberCount: number;

  @IsNumber({}, { message: 'Боловсрол утга байх ёстой.' })
  @IsNotEmpty({ message: 'Боловсрол утга шаардана.' })
  educationId: number;

  @IsString({ message: 'Мэргэжил утга шаардана.' })
  @IsNotEmpty({ message: 'Мэргэжил утга шаардана.' })
  profession: string;

  @IsString({ message: 'Өмнө хийж байсан ажил утга шаардана.' })
  @IsNotEmpty({ message: 'Өмнө хийж байсан ажил утга шаардана.' })
  position: string;
}
