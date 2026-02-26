import { Injectable, HttpException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ReportFilterDto } from 'src/dto/report/ReportFilter.dto';
import * as ExcelJS from 'exceljs';
import { join } from "path";

const fs = require('fs-extra')

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

  // Эсвэл шууд openpyxl-ын загварыг template болгон ашиглаж
  // ExcelJS-ээр өгөгдөл дүүргэх
  async toTemplateExcel(filter: ReportFilterDto): Promise<ExportResult> {
    try {
      if (!process.env.TEMPLATE_FILE_PATH) {
        throw new Error("Template файлын зам тодорхойгүй байна.");
      }
      const fileName = 'report1.xlsx';
      const template = fs.readFileSync(join(__dirname, '../../../', `${process.env.TEMPLATE_FILE_PATH}/excel/${fileName}`));
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(template); // загвар файлыг унших
      const ws = workbook.getWorksheet('Тайлан');

      // const rows = await this.queryData(filter);
      // rows.forEach((r, i) => {
      //   const row = ws.getRow(16 + i);
      //   // row.getCell(1).value = r.group;
      //   // row.getCell(3).value = r.md;
      //   row.commit();
      // });

      const buffer = Buffer.from(await workbook.xlsx.writeBuffer());
      return {
        buffer,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: fileName
      };
    } catch (err) {
      console.log(err);
      throw new HttpException(err, 500);
    }
  }

  async exportReport(filter: ReportFilterDto): Promise<ExportResult> {
    if (filter.format === 'excel') {
      return this.toTemplateExcel(filter);
    }
  }

  //#region [HELPER FUNCTIONS]

  async queryData(filter: ReportFilterDto) {
    return this.dataSource.query(
      `
      SELECT
        group_name   AS "group",
        sub_group    AS "subGroup",
        md_count     AS "md",
        age_16_18    AS "a1618",
        age_19_25    AS "a1925",
        age_26_33    AS "a2633",
        age_34_41    AS "a3441",
        age_42_49    AS "a4249",
        age_50_57    AS "a5057",
        age_58_65    AS "a5865",
        age_65_69    AS "a6569",
        age_70_plus  AS "a70plus",
        buga_count   AS "buga"
      FROM report_table
      WHERE report_date BETWEEN $1 AND $2
      ${filter.departmentId ? 'AND department_id = $3' : ''}
      ORDER BY sort_order
      `,
      filter.departmentId
        ? [filter.startDate, filter.endDate, filter.departmentId]
        : [filter.startDate, filter.endDate],
    );
  }

  //#endregion
}