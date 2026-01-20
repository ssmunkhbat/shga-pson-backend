import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { TableConfigService } from './table-config.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { ListQueryDto } from 'src/dto/listQuery.dto';

@Controller('table-config')
export class TableConfigController {
  constructor(private readonly service: TableConfigService) { }

  
  @Get('list/:tableKey')
  async getList(
    @Param('tableKey') tableKey: string,
    @Query() query: ListQueryDto,
  ) {
    return this.service.getList(tableKey, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('columns/:name')
  async getColumns(@Param('name') name: string) {
    return await this.service.getColumns(name);
  }

  @UseGuards(JwtAuthGuard)
  @Get('actions/byurl')
  async getActionsByPath(@Req() req, @Query('path') path: string) {
    return await this.service.getActionsByPath(path, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('actions/:menuId')
  async getActions(@Req() req, @Param('menuId') menuId: number) {
    return await this.service.getActions(menuId, req.user);
  }
}
