import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TableConfigService } from './table-config.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';

@Controller('table-config')
export class TableConfigController {
  constructor(private readonly service: TableConfigService) { }

  @UseGuards(JwtAuthGuard)
  @Get('columns-metadata/:name')
  async getColumnsMetadata(@Param('name') name: string) {
    return await this.service.getColumnsMetadata(name);
  }
}
