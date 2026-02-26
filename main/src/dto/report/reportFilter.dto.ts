
export class ReportFilterDto {
  startDate: string;
  endDate: string;
  departmentId?: string;
  format?: "excel" | "pdf" | "word";
}