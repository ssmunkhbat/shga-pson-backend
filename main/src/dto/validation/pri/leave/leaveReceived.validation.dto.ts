import { IsNumber, IsNotEmpty, IsDateString, IsBoolean } from 'class-validator';
export class PriLeaveReceivedValidationDto {
  @IsNotEmpty({ message: 'leaveId утга шаардана' })
  @IsNumber({}, { message: 'leaveId байх ёстой' })
  leaveId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'receivedDate огноо утга шаардана.' })
  receivedDate: Date;

  @IsBoolean()
  @IsNotEmpty({ message: 'isCrimeDuringLeave утга шаардана.' })
  isCrimeDuringLeave: boolean;

}