import { IsNumber, IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class PriPrisonerAccountBookValidationDto {

  @IsNumber({}, { message: 'prisonerId утга байх ёстой.' })
  @IsNotEmpty({ message: 'prisonerId утга шаардана.' })
  prisonerId: number;

  @IsOptional()
  @IsNumber({}, { message: 'bookId байх ёстой.' })
  bookId: number;

  @IsNumber({}, { message: 'Төрөл утга байх ёстой.' })
  @IsNotEmpty({ message: 'Төрөл утга шаардана.' })
  bookTypeId: number;

  @IsNumber({}, { message: 'Гүйлгээний төрөл утга байх ёстой.' })
  @IsNotEmpty({ message: 'Гүйлгээний төрөл утга шаардана.' })
  transactionTypeId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Огноо утга шаардана.' })
  bookDate: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Орлогын дүн тоо байх ёстой.' })
  debitAmount: number;

  @IsNumber({}, { message: 'Зарлагын дүн утга байх ёстой.' })
  @IsNotEmpty({ message: 'Зарлагын дүн утга шаардана.' })
  creditAmount: number;

  @IsOptional()
  @IsString({ message: 'Гүйлгээний утга текст байна.' })
  description: string;
}
