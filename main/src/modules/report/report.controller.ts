import { Controller, Get, Post, Query, Req, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ReportService } from './report.service';
import { ReportFilterDto } from 'src/dto/report/ReportFilter.dto';
import { Res, StreamableFile } from '@nestjs/common';
import { Response } from 'express';

@Controller('reports')
export class ReportController {
	constructor(private readonly service: ReportService) { }

  @Get("export")
  async exportReport(@Query() filter: ReportFilterDto, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
  // async exportReport(@Query() filter, @Res({ passthrough: true }) res: Response): Promise<StreamableFile> {
    console.log("exportReport --1--:", filter);
    const { buffer, mimeType, filename } = await this.service.exportReport(filter);

    console.log("exportReport --2--:");
    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    return new StreamableFile(buffer);
  }

  @Get('excel')
  // async getExcel(@Query() filter: ReportFilterDto, @Res() res: Response) {
  async getExcel(@Query() filter, @Res() res: Response) {
    const { buffer, mimeType, filename } = await this.service.toTemplateExcel(filter);
    res.set({
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${filename}"`, // inline = preview
    });
    res.end(buffer);
  }

}
