import { Expose } from '@nestjs/class-transformer';

export class PrisonerCardJailPlanExtentionDto {
    
    @Expose({ name: 'JAIL_BEGIN_DATE' })
    jailBeginDate: Date;
    
    @Expose({ name: 'JAIL_END_DATE' })
    jailEndDate: Date;

    @Expose({ name: 'EMPLOYEE_NAME' })
    employeeName: string;
    
    @Expose({ name: 'DECISION_DATE' })
    decisionDate: Date;

    @Expose({ name: 'DECISION_NUMBER' })
    decisionNumber: string;

    @Expose({ name: 'DEPARTMENT_NAME' })
    departmentName: string;
}