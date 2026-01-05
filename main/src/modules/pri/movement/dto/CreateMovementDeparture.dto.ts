



export class CreateMovementDepartureDto {

  departureDate: string; // YYYY-MM-DD


  fromDepartmentId: number;


  toDepartmentId: number;



  decisionId: number;



  officerId: number;



  officerName: string;



  grantPassword: string;




  prisoners: MovementDepartureDetailDto[];
}

export class MovementDepartureDetailDto {

  prisonerKeyId: number;



  reasonId: number;



  regimenId: number;



  classId: number;



  description: string;



  isSpecialAttention: number;
}
