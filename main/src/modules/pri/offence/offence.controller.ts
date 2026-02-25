import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { OffenceService } from './offence.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt.guard';
import { Response } from 'express';

@Controller('offence')
export class OffenceController {
  constructor(private readonly service: OffenceService) {
  }
  @Get('hello')
  getHello () : string {
    return this.service.getHello()
  }
  @UseGuards(JwtAuthGuard)
  @Get('list')
  getList (@Req() req, @Query('page') page = 1, @Query('limit') limit = 10, @Query('search') search = '[]', @Query('sort') sort = '{}') {
    return this.service.getList({ page, limit }, search, sort, req.user)
  }
  
  @Get('download/excel')
  async downloadExcel(@Req() req, @Res() res: Response) {
    return this.service.downloadExcel(res, req.user);
  }
}
