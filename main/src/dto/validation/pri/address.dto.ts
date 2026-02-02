import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class PriAddressValidationDto {

  @IsNumber({}, { message: 'personId утга байх ёстой.' })
  @IsNotEmpty({ message: 'personId утга шаардана.' })
  personId: number;

  @IsOptional()
  @IsNumber({}, { message: 'addressId байх ёстой.' })
  addressId: number;

  @IsNumber({}, { message: 'Хаягын төрөл утга байх ёстой.' })
  @IsNotEmpty({ message: 'Хаягын төрөл утга шаардана.' })
  addressTypeId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Улс утга байх ёстой.' })
  countryId: number;

  @IsNumber({}, { message: 'Аймаг / хот утга байх ёстой.' })
  @IsNotEmpty({ message: 'Аймаг / хот утга шаардана.' })
  aimagId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Сум / дүүрэг утга байх ёстой.' })
  soumId: number;

  @IsOptional()
  @IsNumber({}, { message: 'Баг / хороо утга байх ёстой.' })
  bagId: number;

  @IsString({ message: 'Дэлгэрэнгүй хаяг утга шаардана.' })
  @IsNotEmpty({ message: 'Дэлгэрэнгүй хаяг утга шаардана.' })
  description: string;
}
