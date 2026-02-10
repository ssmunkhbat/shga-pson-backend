
import { Controller, Get, Query, Req, UseGuards, Post, Body, Delete, Param } from '@nestjs/common';
import { PriLaborService } from './labor.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { TableConfigService } from 'src/modules/table-config/table-config.service';

@Controller('pri-labor')
@UseGuards(JwtAuthGuard)
export class PriLaborController {
  constructor(
    private readonly service: PriLaborService,
    private readonly tableConfigService: TableConfigService
  ) {}

  @Get()
  async list(@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user);
  }

  @Post()
  async createAndUpdate(@Body() body: any, @Req() req: any) {
    return this.service.createAndUpdate(body, req.user);
  }

  @Delete('/:id')
  async delete(@Req() req, @Param('id') id: number) {
    await this.service.delete(id, req.user);
    return { success: true };
  }

  @Get('/prisoner-list')
  async getPrisonerList(@Query() query: any, @Req() req: any) {
    const { page, limit, search } = query;
    return this.service.getPrisonerList({ page, limit }, search, req.user); 
  }

  @Post('/finish')
  async finish(@Body() body: any, @Req() req: any) {
    return this.service.finish(body, req.user);
  }
}
