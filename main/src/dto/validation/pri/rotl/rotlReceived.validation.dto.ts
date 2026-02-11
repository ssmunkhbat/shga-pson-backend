import { IsNumber, IsNotEmpty, IsDateString } from 'class-validator';
export class PriRotlReceivedValidationDto {
  @IsNotEmpty({ message: 'rotlId утга шаардана' })
  @IsNumber({}, { message: 'rotlId байх ёстой' })
  rotlId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'receivedDate огноо утга шаардана.' })
  receivedDate: Date;

}