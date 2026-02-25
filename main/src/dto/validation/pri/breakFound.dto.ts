
import { IsNumber, IsNotEmpty } from 'class-validator';

export class PriBreakFoundValidationDto {
  @IsNotEmpty({ message: 'prisonerBreakId утга шаардана' })
  @IsNumber({}, { message: 'prisonerBreakId байх ёстой' })
  prisonerBreakId: number;

  @IsNotEmpty({ message: 'Олдсон огноо утга шаардана.' })
  foundDate: Date;
}
