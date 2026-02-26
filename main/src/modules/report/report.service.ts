import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReportFilterDto } from 'src/dto/report/ReportFilter.dto';
import * as ExcelJS from 'exceljs';

interface ExportResult {
  buffer: Buffer;
  mimeType: string;
  filename: string;
}

@Injectable()
export class ReportService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async generateHtml(filter: ReportFilterDto): Promise<string> {
    const rows = await this.queryData(filter);

    const tableRows = rows
      .map(
        (r) => `<tr>
        <td>${r.id}</td>
        <td>${r.name}</td>
        <td>${r.department}</td>
        <td>${r.date}</td>
        <td>${r.value}</td>
      </tr>`,
      )
      .join('');

    return `
      <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        h3 { text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc; padding: 6px 8px; }
        th { background: #f0f0f0; text-align: center; }
        td { text-align: center; }
      </style>
      <h3>Тайлан (${filter.startDate} - ${filter.endDate})</h3>
      <table>
        <thead>
          <tr>
            <th>№</th><th>Нэр</th><th>Хэлтэс</th><th>Огноо</th><th>Утга</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    `;
  }

  async exportReport(filter: ReportFilterDto): Promise<ExportResult> {
    const html = await this.generateHtml(filter);

    if (filter.format === 'excel') {
      return this.toExcel(filter);
    } else if (filter.format === 'pdf') {
      return this.toPdf(html, filter);
    } else {
      return this.toWord(filter);
    }
  }

  //#region [HELPER FUNCTIONS]

  async queryData(filter: ReportFilterDto) {
    return [
      { id: 1, name: 'Жишээ 1', department: 'Нягтлан', date: filter.startDate, value: 100 },
      { id: 2, name: 'Жишээ 2', department: 'Хүний нөөц', date: filter.endDate, value: 200 },
    ];
  }

  async toExcel(filter: ReportFilterDto): Promise<ExportResult> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Тайлан');
    sheet.addRow(['№', 'Нэр', 'Хэлтэс', 'Огноо', 'Утга']);
    const rows = await this.queryData(filter);
    rows.forEach((r) => sheet.addRow([r.id, r.name, r.department, r.date, r.value]));

    const excelBuffer = await workbook.xlsx.writeBuffer();
    const buffer = Buffer.from(excelBuffer);

    return {
      buffer,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      filename: `report_${filter.startDate}.xlsx`,
    };
  }

  async toPdf(html: string, filter: ReportFilterDto): Promise<ExportResult> {
    // const browser = await puppeteer.launch({ headless: true });
    // const page = await browser.newPage();
    // await page.setContent(html);
    // const pdfBuffer = await page.pdf({ format: "A4" });
    // await browser.close();
    const buffer = Buffer.from('pdf placeholder');
    return {
      buffer,
      mimeType: 'application/pdf',
      filename: `report_${filter.startDate}.pdf`,
    };
  }

  async toWord(filter: ReportFilterDto): Promise<ExportResult> {
    // const doc = new docx.Document({ sections: [...] });
    // const buffer = await docx.Packer.toBuffer(doc);
    const buffer = Buffer.from('word placeholder');
    return {
      buffer,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      filename: `report_${filter.startDate}.docx`,
    };
  }

  //#endregion
}